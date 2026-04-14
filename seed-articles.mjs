import mysql from "mysql2/promise";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const articlesDataPath = join(__dirname, "shared", "articles-data.json");
const articlesData = JSON.parse(readFileSync(articlesDataPath, "utf-8"));

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  try {
    console.log("🌱 Seeding articles...");

    const connection = await mysql.createConnection(process.env.DATABASE_URL);

    // Upsert articles（重複エラーを避けるため、既存記事は更新、新規記事は挿入）
    console.log("📝 Upserting articles...");
    let insertCount = 0;
    let updateCount = 0;

    for (const article of articlesData.articles) {
      // 記事が既に存在するか確認
      const [existingArticles] = await connection.execute(
        "SELECT id FROM articles WHERE id = ?",
        [article.id]
      );

      if (existingArticles.length > 0) {
        // 既存記事は更新
        await connection.execute(
          `UPDATE articles SET 
            categoryId = ?, 
            title = ?, 
            description = ?, 
            slug = ?, 
            content = ?, 
            difficulty = ?, 
            readingTime = ?, 
            views = ?, 
            updatedAt = NOW()
          WHERE id = ?`,
          [
            article.categoryId,
            article.title,
            article.description,
            article.slug,
            article.content,
            article.difficulty,
            article.readingTime,
            article.views,
            article.id,
          ]
        );
        updateCount++;
      } else {
        // 新規記事は挿入
        await connection.execute(
          `INSERT INTO articles 
            (id, categoryId, title, description, slug, content, difficulty, readingTime, views, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            article.id,
            article.categoryId,
            article.title,
            article.description,
            article.slug,
            article.content,
            article.difficulty,
            article.readingTime,
            article.views,
          ]
        );
        insertCount++;
      }
    }

    console.log(`✅ Successfully seeded articles`);
    console.log(`  📝 Inserted: ${insertCount}`);
    console.log(`  🔄 Updated: ${updateCount}`);

    // Verify
    const result = await connection.execute(
      "SELECT COUNT(*) as count FROM articles"
    );
    console.log(`📊 Total articles in DB: ${result[0][0].count}`);

    // Count by category
    const categoryCount = await connection.execute(
      "SELECT categoryId, COUNT(*) as count FROM articles GROUP BY categoryId"
    );
    console.log("📂 Articles by category:");
    categoryCount[0].forEach((row) => {
      console.log(`  ${row.categoryId}: ${row.count}`);
    });

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
