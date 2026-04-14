import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, articles, favorites, userProgress } from "../drizzle/schema";
import { ENV } from './_core/env';
import fs from 'fs';
import path from 'path';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Articles queries
 */

let articlesCache: any[] | null = null;

function normalizeSearchText(input: string) {
  return input
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\u30a1-\u30f6]/g, (char) =>
      String.fromCharCode(char.charCodeAt(0) - 0x60)
    )
    .trim();
}

function getArticlesFromJSON() {
  if (articlesCache) return articlesCache;
  
  try {
    const filePath = path.join(process.cwd(), 'shared', 'articles-data.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    articlesCache = (data.articles || []).map((article: any) => ({
      id: article.id || article.slug,
      slug: article.slug,
      title: article.title,
      description: article.description,
      content: article.content || '',
      categoryId: article.categoryId || article.category || 'other',
      category: article.category,
      difficulty: article.difficulty || 'beginner',
      readingTime: article.readingTime || 5,
      views: article.views || 0,
      createdAt: article.createdAt || new Date().toISOString(),
    }));
    return articlesCache;
  } catch (error) {
    console.warn('[Articles] Failed to load from JSON:', error);
    return [];
  }
}

export async function getAllArticles() {
  const db = await getDb();
  if (db) {
    try {
      return await db.select().from(articles);
    } catch (error) {
      console.warn('[Articles] Failed to get from DB, falling back to JSON:', error);
    }
  }
  return getArticlesFromJSON();
}

export async function getArticleById(id: string) {
  const db = await getDb();
  if (db) {
    try {
      const result = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
      if (result.length > 0) return result[0];
    } catch (error) {
      console.warn('[Articles] Failed to get by ID from DB, falling back to JSON:', error);
    }
  }
  
  const allArticles = getArticlesFromJSON() || [];
  return allArticles.find(a => a.id === id || a.slug === id);
}

export async function getArticlesByCategory(categoryId: string) {
  const db = await getDb();
  if (db) {
    try {
      return await db.select().from(articles).where(eq(articles.categoryId, categoryId));
    } catch (error) {
      console.warn('[Articles] Failed to get by category from DB, falling back to JSON:', error);
    }
  }
  
  const allArticles = getArticlesFromJSON() || [];
  return allArticles.filter(a => a.categoryId === categoryId || a.category === categoryId);
}

export async function searchArticles(keyword: string) {
  const allArticles = (await getAllArticles()) || [];
  const normalizedKeyword = normalizeSearchText(keyword);
  return allArticles.filter(article =>
    normalizeSearchText(
      `${article.title ?? ""} ${article.description ?? ""} ${article.content ?? ""}`
    ).includes(normalizedKeyword)
  );
}

/**
 * Favorites queries
 */
export async function getUserFavorites(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const favs = await db.select().from(favorites).where(eq(favorites.userId, userId));
  const articleIds = favs.map(f => f.articleId);
  if (articleIds.length === 0) return [];
  return db.select().from(articles).where(sql`${articles.id} IN (${articleIds.join(',')})`);
}

export async function addFavorite(userId: number, articleId: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(favorites).values({ userId, articleId });
}

export async function removeFavorite(userId: number, articleId: string) {
  const db = await getDb();
  if (!db) return;
  await db.delete(favorites).where(
    sql`${favorites.userId} = ${userId} AND ${favorites.articleId} = ${articleId}`
  );
}

export async function isFavorited(userId: number, articleId: string) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(favorites).where(
    sql`${favorites.userId} = ${userId} AND ${favorites.articleId} = ${articleId}`
  ).limit(1);
  return result.length > 0;
}

/**
 * User progress queries
 */
export async function getUserProgress(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userProgress).where(eq(userProgress.userId, userId));
}

export async function updateUserProgress(userId: number, roadmapStepId: string, completed: boolean) {
  const db = await getDb();
  if (!db) return;
  
  const existing = await db.select().from(userProgress).where(
    sql`${userProgress.userId} = ${userId} AND ${userProgress.roadmapStepId} = ${roadmapStepId}`
  ).limit(1);
  
  if (existing.length > 0) {
    await db.update(userProgress).set({
      completed: completed ? 1 : 0,
      completedAt: completed ? new Date() : null,
    }).where(
      sql`${userProgress.userId} = ${userId} AND ${userProgress.roadmapStepId} = ${roadmapStepId}`
    );
  } else {
    await db.insert(userProgress).values({
      userId,
      roadmapStepId,
      completed: completed ? 1 : 0,
      completedAt: completed ? new Date() : null,
    });
  }
}
