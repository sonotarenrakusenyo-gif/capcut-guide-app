/**
 * 用語統一パッチ：「カット（ボタン操作）」→「分割」
 * 対象：ベーシックシリーズ・YouTubeシリーズ
 *
 * ルール：
 *  - CapCutのUIボタン操作（再生ヘッドを置いて押す動作）→「分割」
 *  - 編集概念・技法名（ジャンプカット・カット編集・L字カット等）→「カット」のまま
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const patches = [
  // ─── basic-001 ─────────────────────────────────────────
  {
    id: "basic-001",
    label: "PC版ステップ2の見出し",
    from: `### ステップ2：タイムラインでカット`,
    to:   `### ステップ2：タイムラインで分割`,
  },
  {
    id: "basic-001",
    label: "再生ヘッドをカット位置へ",
    from: `**再生ヘッド**をカット位置へ移動します。`,
    to:   `**再生ヘッド**を分割位置へ移動します。`,
  },

  // ─── basic-002 ─────────────────────────────────────────
  {
    id: "basic-002",
    label: "カット位置をフレーム単位に",
    from: `カット位置をフレーム単位に近づけます。`,
    to:   `分割位置をフレーム単位に近づけます。`,
  },

  // ─── basic-005 ─────────────────────────────────────────
  {
    id: "basic-005",
    label: "PC版：カット後に音だけ残る",
    from: `カット後に**音だけ残る／映像だけ残る**を確認してください。`,
    to:   `分割後に**音だけ残る／映像だけ残る**を確認してください。`,
  },

  // ─── basic-015 ─────────────────────────────────────────
  {
    id: "basic-015",
    label: "この記事で分かること：再生・カット・分割など",
    from: `- 再生・カット・分割など**頻出操作**のショートカット`,
    to:   `- 再生・**分割**など**頻出操作**のショートカット`,
  },

  // ─── youtube-004 ───────────────────────────────────────
  {
    id: "youtube-004",
    label: "この記事で分かること：カットする「ビート編集」の手順",
    from: `- 音楽の**ビート（拍）**に合わせてカットする「ビート編集」の手順`,
    to:   `- 音楽の**ビート（拍）**に合わせて**「分割」**する「ビート編集」の手順`,
  },
  {
    id: "youtube-004",
    label: "ステップ3の見出し：マーカーに合わせてカットする",
    from: `### ステップ3：マーカーに合わせてカットする`,
    to:   `### ステップ3：マーカーに合わせて分割する`,
  },
  {
    id: "youtube-004",
    label: "「分割」でクリップをカットします",
    from: `**「分割」**でクリップをカットします。`,
    to:   `**「分割」**でクリップを分割します。`,
  },
  {
    id: "youtube-004",
    label: "カットした映像クリップの長さを",
    from: `カットした映像クリップの長さをビート間隔に揃えると、自然なリズム感が生まれます。`,
    to:   `分割した映像クリップの長さをビート間隔に揃えると、自然なリズム感が生まれます。`,
  },
  {
    id: "youtube-004",
    label: "サビ：ビート1つごとにカット",
    from: `- **サビ・盛り上がり部分**：ビート1つごとにカット（速いテンポ）`,
    to:   `- **サビ・盛り上がり部分**：ビート1つごとに**「分割」**（速いテンポ）`,
  },
  {
    id: "youtube-004",
    label: "イントロ：2〜4ビートごとにカット",
    from: `- **イントロ・落ち着いた部分**：2〜4ビートごとにカット（遅めのテンポ）`,
    to:   `- **イントロ・落ち着いた部分**：2〜4ビートごとに**「分割」**（遅めのテンポ）`,
  },
  {
    id: "youtube-004",
    label: "音の山の位置でカットします",
    from: `**音の山（大きくなる部分）**の位置でカットします`,
    to:   `**音の山（大きくなる部分）**の位置で**「分割」**します`,
  },

  // ─── youtube-013 ───────────────────────────────────────
  {
    id: "youtube-013",
    label: "テーブル：積極的にカット・早送りを活用",
    from: `| 長時間で無駄な操作が多い | 積極的にカット・早送りを活用 |`,
    to:   `| 長時間で無駄な操作が多い | 積極的に**「分割」→削除**・早送りを活用 |`,
  },
  {
    id: "youtube-013",
    label: "ステップ2：不要部分を大量カットする",
    from: `### ステップ2：不要部分を大量カットする`,
    to:   `### ステップ2：不要部分を大量分割・削除する`,
  },

  // ─── youtube-015 ───────────────────────────────────────
  {
    id: "youtube-015",
    label: "フル尺編集：不要部分だけカット",
    from: `| **フル尺編集** | ほぼそのままで不要部分だけカット |`,
    to:   `| **フル尺編集** | ほぼそのままで不要部分だけ分割・削除 |`,
  },
  {
    id: "youtube-015",
    label: "ステップ2：不要部分を大量カット",
    from: `### ステップ2：不要部分を大量カット`,
    to:   `### ステップ2：不要部分を大量分割・削除`,
  },

  // ─── youtube-jumpcut ───────────────────────────────────
  {
    id: "youtube-jumpcut",
    label: "この記事で分かること：自動で検出してカットする手順",
    from: `- **無音・言い淀みを自動で検出してカット**する手順`,
    to:   `- **無音・言い淀みを自動で検出して分割・削除**する手順`,
  },
  {
    id: "youtube-jumpcut",
    label: "手動カットで対応します",
    from: `見つからない場合は手動カットで対応します。`,
    to:   `見つからない場合は手動で**「分割」**して対応します。`,
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

console.log("\n=== 用語統一パッチ結果 ===\n");
results.forEach(r => console.log(`${r.status}  [${r.id}] ${r.label}`));
console.log(`\n合計 ${results.filter(r => r.status.startsWith("✅")).length}/${patches.length} 箇所を修正しました。`);
