/**
 * Geminiフィードバック反映パッチ（ベーシックシリーズ 3か所）
 * basic-005 / basic-007 / basic-010
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

// ---- パッチ定義 ----

// 1. basic-005：ステップ3にノイズ除去の一文を追加
const patch005 = {
  id: "basic-005",
  from: `### ステップ3：音量を下げる（ナレーション優先）
- BGMのクリップを選択し、**音量スライダー**を下げます。目安として、**ナレーションや会話が主**ならBGMは控えめ（例：**20〜40%** 付近から耳で調整）にします。`,
  to: `### ステップ3：音量を下げる（ナレーション優先）
- BGMのクリップを選択し、**音量スライダー**を下げます。目安として、**ナレーションや会話が主**ならBGMは控えめ（例：**20〜40%** 付近から耳で調整）にします。
- 周囲の雑音が気になる場合は、音声クリップを選択して**「ノイズを低減」**（または「ノイズ除去」）をオンにするだけで声が劇的にクリアになります。`,
};

// 2. basic-007：ステップ4にオプティカルフローの正式名を追記
const patch007 = {
  id: "basic-007",
  from: `### ステップ4：スローでカクつくとき（該当する場合）
- **1倍速未満**のスローモーションでは、**スムーズ**系の処理（表記は端末・バージョンで「スムーズにする」など）を選ぶと、補正のため**処理時間が伸びる**代わりになめらかになります。画質優先か速度優先かを選べる場合は、まず**画質優先**で試します。`,
  to: `### ステップ4：スローでカクつくとき（該当する場合）
- **1倍速未満**のスローモーションでは、**「スムーズなスローモーション」**または**「光学的流動（Optical Flow）」**を選ぶと、AIがコマとコマの間を自動補完してヌルヌル動くなめらかなスローになります。補正のため**処理時間が伸びます**が、画質は大幅に向上します。表記はバージョンにより「スムーズにする」「オプティカルフロー」などに変わることがあります。`,
};

// 3. basic-010：ステップ3にひし形の色変化を追記
const patch010 = {
  id: "basic-010",
  from: `### ステップ3：1点目のキーフレームを打つ
- 再生ヘッドを**開始位置**に置き、**位置**や**スケール**を設定し、**ひし形をタップ**してキーフレームを追加します。`,
  to: `### ステップ3：1点目のキーフレームを打つ
- 再生ヘッドを**開始位置**に置き、**位置**や**スケール**を設定し、**ひし形をタップ**してキーフレームを追加します。
- キーフレームが正しく打てると、ひし形アイコンの色が**白から赤（またはオレンジ）**に変わります。色が変わっていることを確認してから次のステップに進みましょう。`,
};

const patches = [patch005, patch007, patch010];

// ---- 3つのJSONファイルに適用 ----
const targets = [
  "articles-data.json",
  "shared/articles-data.json",
  "src/data/articles-data.json",
];

for (const rel of targets) {
  const fp = path.join(root, rel);
  const data = JSON.parse(fs.readFileSync(fp, "utf8"));

  data.articles = data.articles.map((a) => {
    const patch = patches.find((p) => p.id === a.id);
    if (!patch) return a;

    if (!a.content.includes(patch.from)) {
      console.warn(`⚠️  パッチ対象テキストが見つかりません: ${a.id} in ${rel}`);
      return a;
    }

    return { ...a, content: a.content.replace(patch.from, patch.to) };
  });

  fs.writeFileSync(fp, JSON.stringify(data, null, 2));
}

console.log("✅ パッチ適用完了:", patches.map((p) => p.id).join(", "));
