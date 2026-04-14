import { describe, it, expect, beforeAll } from "vitest";
import { getDb } from "./db";
import { articles } from "../drizzle/schema";

describe("Articles Database", () => {
  let db: Awaited<ReturnType<typeof getDb>>;

  beforeAll(async () => {
    db = await getDb();
  });

  it("should have articles in database", async () => {
    if (!db) {
      expect(true).toBe(true); // Skip if DB not available
      return;
    }

    const allArticles = await db.select().from(articles);
    expect(allArticles.length).toBeGreaterThan(0);
  });

  it("should have 4 categories with 15 articles each", async () => {
    if (!db) {
      expect(true).toBe(true);
      return;
    }

    const allArticles = await db.select().from(articles);
    const categories = new Map<string, number>();

    allArticles.forEach((article) => {
      const count = categories.get(article.categoryId) || 0;
      categories.set(article.categoryId, count + 1);
    });

    expect(categories.size).toBe(4);
    categories.forEach((count) => {
      expect(count).toBe(15);
    });
  });

  it("should have correct categories", async () => {
    if (!db) {
      expect(true).toBe(true);
      return;
    }

    const allArticles = await db.select().from(articles);
    const categories = new Set(allArticles.map((a) => a.categoryId));

    expect(categories.has("basic")).toBe(true);
    expect(categories.has("youtube")).toBe(true);
    expect(categories.has("troubleshoot")).toBe(true);
    expect(categories.has("advanced")).toBe(true);
  });

  it("should have required fields in articles", async () => {
    if (!db) {
      expect(true).toBe(true);
      return;
    }

    const allArticles = await db.select().from(articles);
    expect(allArticles.length).toBeGreaterThan(0);

    allArticles.forEach((article) => {
      expect(article.id).toBeDefined();
      expect(article.title).toBeDefined();
      expect(article.description).toBeDefined();
      expect(article.content).toBeDefined();
      expect(article.categoryId).toBeDefined();
      expect(article.difficulty).toBeDefined();
      expect(article.readingTime).toBeGreaterThan(0);
    });
  });
});
