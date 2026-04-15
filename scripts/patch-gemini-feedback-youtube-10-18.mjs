/**
 * Geminiフィードバック反映パッチ（YouTubeシリーズ後半 4か所）
 * youtube-011 / youtube-013 / youtube-retention / youtube-jumpcut
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const patches = [
  // 1. youtube-011：ステップ4にAIカラーマッチングを追記
  {
    id: "youtube-011",
    label: "カラーグレーディング：AIカラーマッチング",
    from: `### ステップ4：全クリップに統一する
- 設定したフィルター・調整をコピーし、他のクリップに**ペースト**します
- 同じシーンの映像は同じカラーに揃えることで「統一感のある動画」になります`,
    to: `### ステップ4：全クリップに統一する
- 設定したフィルター・調整をコピーし、他のクリップに**ペースト**します
- 同じシーンの映像は同じカラーに揃えることで「統一感のある動画」になります

### ステップ5：AIカラーマッチングを使う（2026年最新機能）
- **「AIカラーマッチング」**（または**「カラーマッチ」**）機能を使うと、参考にしたい画像・動画の色味をボタン一つで自分の映像に自動コピーできます
- 使い方：クリップを選択→**「調整」**→**「カラーマッチ」**→参考画像を選択→強度を調整
- お気に入りの映画・MV・インスタ投稿の雰囲気を即座に再現できる、初心者にも強力な時短機能です`,
  },

  // 2. youtube-013：「スクリーン録画映像の特徴と注意点」テーブルの後に解像度注意を追記
  {
    id: "youtube-013",
    label: "スクリーンレコーディング：解像度不一致の注意",
    from: `## スマホ版：スクリーン録画を編集する基本手順`,
    to: `## 解像度の不一致に注意
ゲーム実況など高解像度の録画（例：2K・4K）をCapCutで**1080pに書き出す**際、設定を合わせていないとテロップや合成素材がぼやけることがあります。

- **録画解像度**と**CapCutのエクスポート設定**をできるだけ同じ解像度に揃えましょう
- YouTubeにアップするなら**1920×1080（フルHD）**が標準。録画もFHDに設定しておくと扱いやすいです
- 解像度が違う場合は、CapCutの**「設定（プロジェクト設定）」**でプロジェクトの解像度を録画素材に合わせてから編集を始めます

## スマホ版：スクリーン録画を編集する基本手順`,
  },

  // 3. youtube-retention：上達のコツの前にShortsのループテクニックを追記
  {
    id: "youtube-retention",
    label: "視聴維持率：Shortsのループテクニック",
    from: `## 上達のコツ
まず**YouTubeアナリティクスで「視聴者が最も離脱している時間帯」**を確認しましょう。`,
    to: `## Shortsで使える「ループ編集」の裏技
ショート動画（Shorts）では、**動画の最後と最初がシームレスにつながるようにループ編集**すると、視聴者が気づかないうちに2周目を見てしまい、**視聴維持率が200%を超える**ことがあります。

**実装方法**：
- 動画の最後のシーンが、冒頭と同じセリフ・場面・動きに戻るように編集する
- 例：冒頭「この方法、知ってますか？」→最後「…ということで、この方法、知ってましたか？」→冒頭に戻る
- アニメーション・ダンス系は特にループと相性が良く、「もう一回見てしまう」状態を意図的に作れます

## 上達のコツ
まず**YouTubeアナリティクスで「視聴者が最も離脱している時間帯」**を確認しましょう。`,
  },

  // 4. youtube-jumpcut：「視聴者が気づかないジャンプカットにするコツ」にJカットを追記
  {
    id: "youtube-jumpcut",
    label: "ジャンプカット：Jカット（音の先行）テクニック",
    from: `**②BGMを途切れなく流す**
- 音楽が流れていると、映像のジャンプが目立ちにくくなります`,
    to: `**②BGMを途切れなく流す**
- 音楽が流れていると、映像のジャンプが目立ちにくくなります

**②' Jカット（音を0.1秒先行させる）上級テクニック**
- カットの繋ぎ目で、前のクリップの音が完全に消える前に次のクリップの音が**0.1〜0.2秒だけ重なる**ように調整する「Jカット」テクニックが効果的です
- これによりブツ切れ感がなくなり、テレビ番組・映画のような滑らかなテンポになります
- CapCutでの実装：音声クリップのエッジをドラッグして微妙に重ね、音量フェードを組み合わせます`,
  },
];

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
    let content = a.content;
    let patched = false;
    for (const p of patches) {
      if (p.id !== a.id) continue;
      if (!content.includes(p.from)) {
        console.warn(`⚠️  テキストが見つかりません [${p.label}] in ${rel}`);
        continue;
      }
      content = content.replace(p.from, p.to);
      patched = true;
    }
    return patched ? { ...a, content } : a;
  });

  fs.writeFileSync(fp, JSON.stringify(data, null, 2));
}

const ids = [...new Set(patches.map((p) => p.id))];
console.log("✅ パッチ適用完了:", ids.join(", "), `（${patches.length}か所）`);
