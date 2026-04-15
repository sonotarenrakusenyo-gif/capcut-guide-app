/**
 * 用語統一パッチ：トラブルシューティング・高度な応用シリーズ
 * ボタン操作を指す「カット」→「分割」
 *
 * 判定結果：
 *  - advanced-008 のみ3か所変更が必要
 *  - その他の「カット」はすべて「概念・技法名・UI機能名・音響用語」のため変更不要
 *
 * 変更しない理由一覧：
 *  - AIスマートカット / AIカット → CapCut UI機能名（固有名詞）
 *  - カット編集 / カット位置 / 精密カット → 編集概念・技法名
 *  - ラフカット / ファインカット → 映像制作の専門用語
 *  - 低域をカット（EQ） → 音響工学用語（別ドメイン）
 *  - シンプルなカット / カットとフェード → トランジション技法の概念
 *  - なぜここでカットしているのか → 編集の意図を問う概念的表現
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const patches = [
  // ─── advanced-008 ──────────────────────────────────────────
  // 「動作の瞬間に合わせる精密カット」ステップ内の操作手順
  {
    id: "advanced-008",
    label: "見つけ方ステップ4：1〜2フレーム前でカットする",
    from: `4. そのフレームの**1〜2フレーム前**でカットするとテンポ感が出る`,
    to:   `4. そのフレームの**1〜2フレーム前**で**「分割」**するとテンポ感が出る`,
  },
  {
    id: "advanced-008",
    label: "解説文：1〜2フレーム前でカット・わずかに先にカット",
    from: `「1〜2フレーム前でカット」するのはプロの技術です。視聴者の脳は実際のインパクトより少し前に「くる」と感知しているため、わずかに先にカットする方が気持ちよく感じます。`,
    to:   `「1〜2フレーム前で**「分割」**」するのはプロの技術です。視聴者の脳は実際のインパクトより少し前に「くる」と感知しているため、わずかに先に**「分割」**する方が気持ちよく感じます。`,
  },
  {
    id: "advanced-008",
    label: "見つけ方：一番決まった瞬間でカット",
    from: `スポーツ・ダンス・格闘技などでは、動作の「一番決まった瞬間」でカットすると映像がかっこよく見えます：`,
    to:   `スポーツ・ダンス・格闘技などでは、動作の「一番決まった瞬間」で**「分割」**すると映像がかっこよく見えます：`,
  },
];

// ---- 3つのJSONファイルに適用 ----
const targets = [
  "articles-data.json",
  "shared/articles-data.json",
  "src/data/articles-data.json",
];

const results = [];

for (const rel of targets) {
  const fp = path.join(root, rel);
  const data = JSON.parse(fs.readFileSync(fp, "utf8"));

  data.articles = data.articles.map((a) => {
    let content = a.content;
    let patched = false;
    for (const p of patches) {
      if (p.id !== a.id) continue;
      if (!content.includes(p.from)) {
        if (rel === "articles-data.json") {
          results.push({ status: "⚠️  NOT FOUND", id: p.id, label: p.label });
        }
        continue;
      }
      content = content.replace(p.from, p.to);
      patched = true;
      if (rel === "articles-data.json") {
        results.push({ status: "✅ PATCHED", id: p.id, label: p.label });
      }
    }
    return patched ? { ...a, content } : a;
  });

  fs.writeFileSync(fp, JSON.stringify(data, null, 2));
}

console.log("\n=== トラブルシューティング・高度な応用 用語統一パッチ結果 ===\n");
results.forEach(r => console.log(`${r.status}  [${r.id}] ${r.label}`));
console.log(`\n合計 ${results.filter(r => r.status.startsWith("✅")).length}/${patches.length} 箇所を修正しました。`);
