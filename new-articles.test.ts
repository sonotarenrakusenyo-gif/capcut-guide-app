import { describe, expect, it } from "vitest";
import mysql from "mysql2/promise";

/**
 * 新規6記事のデータベース検証テスト
 * - トラブル解決3記事
 * - YouTube実践3記事
 * 
 * 各記事について以下を検証：
 * 1. 記事IDが正しく存在する
 * 2. カテゴリが正しく設定されている
 * 3. 難易度が設定されている
 * 4. 読了時間が設定されている
 * 5. コンテンツに「よくある失敗例」が含まれている
 * 6. コンテンツに「解決方法」が含まれている
 */

describe("新規6記事のデータベース検証", () => {
  const newArticles = [
    {
      id: "troubleshoot-batch-edit",
      title: "文字を一括で揃えたい - 一括編集機能の完全ガイド",
      category: "troubleshoot",
      difficulty: "初級",
    },
    {
      id: "troubleshoot-insert-video",
      title: "動画の間に動画を正しく入れたい - 磁石機能とクリップ挿入ガイド",
      category: "troubleshoot",
      difficulty: "中級",
    },
    {
      id: "troubleshoot-pip",
      title: "ピクチャーインピクチャー（PiP）実装ガイド - YouTube実況者向けオーバーレイ解説",
      category: "troubleshoot",
      difficulty: "中級",
    },
    {
      id: "youtube-jumpcut",
      title: "ジャンプカット（無音カット）完全ガイド - 視聴者を飽きさせないテクニック",
      category: "youtube",
      difficulty: "初級",
    },
    {
      id: "youtube-caption-design",
      title: "自動キャプション一括デザイン変更テクニック - 効率的なテロップ作成",
      category: "youtube",
      difficulty: "初級",
    },
    {
      id: "youtube-retention",
      title: "視聴維持率を上げるテロップとSE入れ方 - プロの編集テクニック",
      category: "youtube",
      difficulty: "中級",
    },
  ];

  it("新規6記事がすべてデータベースに存在する", async () => {
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);

    for (const article of newArticles) {
      const [results] = await connection.execute(
        "SELECT id, title FROM articles WHERE id = ?",
        [article.id]
      );

      expect(results).toHaveLength(1);
      expect((results as any)[0].id).toBe(article.id);
    }

    await connection.end();
  });

  it("各記事のカテゴリが正しく設定されている", async () => {
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);

    for (const article of newArticles) {
      const [results] = await connection.execute(
        "SELECT categoryId FROM articles WHERE id = ?",
        [article.id]
      );

      expect(results).toHaveLength(1);
      expect((results as any)[0].categoryId).toBe(article.category);
    }

    await connection.end();
  });

  it("各記事の難易度が正しく設定されている", async () => {
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);

    for (const article of newArticles) {
      const [results] = await connection.execute(
        "SELECT difficulty FROM articles WHERE id = ?",
        [article.id]
      );

      expect(results).toHaveLength(1);
      expect((results as any)[0].difficulty).toBe(article.difficulty);
    }

    await connection.end();
  });

  it("各記事に読了時間が設定されている", async () => {
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);

    for (const article of newArticles) {
      const [results] = await connection.execute(
        "SELECT readingTime FROM articles WHERE id = ?",
        [article.id]
      );

      expect(results).toHaveLength(1);
      expect((results as any)[0].readingTime).toBeGreaterThan(0);
    }

    await connection.end();
  });

  it("各記事のコンテンツに「よくある失敗例」が含まれている", async () => {
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);

    for (const article of newArticles) {
      const [results] = await connection.execute(
        "SELECT content FROM articles WHERE id = ?",
        [article.id]
      );

      expect(results).toHaveLength(1);
      const content = (results as any)[0].content;
      expect(content).toContain("よくある失敗例");
    }

    await connection.end();
  });

  it("各記事のコンテンツに「解決方法」が含まれている", async () => {
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);

    for (const article of newArticles) {
      const [results] = await connection.execute(
        "SELECT content FROM articles WHERE id = ?",
        [article.id]
      );

      expect(results).toHaveLength(1);
      const content = (results as any)[0].content;
      expect(content).toContain("解決方法");
    }

    await connection.end();
  });

  it("各記事のコンテンツに「原則」または「テクニック」が含まれている", async () => {
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);

    for (const article of newArticles) {
      const [results] = await connection.execute(
        "SELECT content FROM articles WHERE id = ?",
        [article.id]
      );

      expect(results).toHaveLength(1);
      const content = (results as any)[0].content;
      // 「原則」または「テクニック」を含むことを確認
      const hasStructure = content.includes("原則") || content.includes("テクニック");
      expect(hasStructure).toBe(true);
    }

    await connection.end();
  });

  it("トラブル解決記事が3件存在する", async () => {
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);

    const [results] = await connection.execute(
      "SELECT COUNT(*) as count FROM articles WHERE categoryId = ?",
      ["troubleshoot"]
    );

    const count = (results as any)[0].count;
    expect(count).toBeGreaterThanOrEqual(18); // 元の15件 + 新規3件

    await connection.end();
  });

  it("YouTube実践記事が3件以上存在する", async () => {
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);

    const [results] = await connection.execute(
      "SELECT COUNT(*) as count FROM articles WHERE categoryId = ?",
      ["youtube"]
    );

    const count = (results as any)[0].count;
    expect(count).toBeGreaterThanOrEqual(18); // 元の15件 + 新規3件

    await connection.end();
  });

  it("全記事数が66件以上である", async () => {
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);

    const [results] = await connection.execute(
      "SELECT COUNT(*) as count FROM articles"
    );

    const count = (results as any)[0].count;
    expect(count).toBeGreaterThanOrEqual(66);

    await connection.end();
  });
});
