/**
 * Geminiフィードバック反映パッチ（トラブル解決シリーズ 5か所）
 * troubleshoot-003 / troubleshoot-004 / troubleshoot-007 / troubleshoot-008 / troubleshoot-pip
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const patches = [
  // 1a. troubleshoot-003：エクスポート中に落ちる「原因」に低電力モードを追記
  {
    id: "troubleshoot-003",
    label: "クラッシュ：低電力モードの罠を追記",
    from: `**原因**：端末のメモリ不足・ストレージ不足・熱暴走

**対処法**：
1. 他のアプリをすべて終了してからエクスポートを再試行`,
    to: `**原因**：端末のメモリ不足・ストレージ不足・熱暴走・低電力モード

> **注意**：スマホの**「低電力モード（バッテリー節約モード）」がONになっている**と、OSが処理能力を意図的に制限するため、書き出し中にCapCutが強制終了されやすくなります。エクスポート前に必ずオフにしてください（iOS：設定 → バッテリー → 低電力モード、Android：設定 → バッテリー → 節電モード）。

**対処法**：
1. **低電力モードをオフ**にしてからエクスポートを再試行
2. 他のアプリをすべて終了してからエクスポートを再試行`,
  },

  // 1b. troubleshoot-004：確実な書き出し手順の項目3に低電力モードの説明を補強
  {
    id: "troubleshoot-004",
    label: "エクスポート失敗：低電力モードの説明を補強",
    from: `3. 端末を充電しながらエクスポート（バッテリー節約モードをオフ）`,
    to: `3. 端末を充電しながらエクスポート（**バッテリー節約モード・低電力モードを必ずオフ**にする：ONのままだと処理が絞られ強制終了の原因になります）`,
  },

  // 2. troubleshoot-008：チェックリストにスマートHDRの確認を追記
  {
    id: "troubleshoot-008",
    label: "画質が悪い：スマートHDRの注意を追記",
    from: `- [ ] 解像度：1080p 以上になっているか
- [ ] fps：元素材と合っているか（30 or 60）
- [ ] コーデック：H.264（MP4）になっているか
- [ ] 品質スライダー：「推奨」以上になっているか
- [ ] プロジェクト内でズームしすぎていないか`,
    to: `- [ ] 解像度：1080p 以上になっているか
- [ ] fps：元素材と合っているか（30 or 60）
- [ ] コーデック：H.264（MP4）になっているか
- [ ] 品質スライダー：「推奨」以上になっているか
- [ ] プロジェクト内でズームしすぎていないか
- [ ] **スマートHDR**：エクスポートやカメラ設定で「スマートHDR」がONになっていると、投稿先のSNSによっては色が飛んだり白くなったりすることがあります。色味がおかしいと感じたら、まず**OFFにして書き出し直す**のが安全です`,
  },

  // 3. troubleshoot-007：即効対処の後に「未使用素材の削除」機能を追記
  {
    id: "troubleshoot-007",
    label: "ストレージ不足：未使用素材の整理機能を追記",
    from: `## CapCutが使うファイルの種類と削除の安全性`,
    to: `## 未使用素材をまとめて削除する（バージョンによる機能）
CapCutの一部バージョンには、プロジェクト内で**使われていない素材を一括削除**する**「未使用のメディアを削除（Delete unused media）」**ボタンが搭載されています。

- **場所**：プロジェクト内の素材パネル or 設定メニューから探す
- **効果**：読み込んだものの使わなかった動画・画像が一括整理でき、「どれを消していいか分からない」問題を解決できます
- **注意**：削除前に「本当に使っていないか」確認してから実行してください。元に戻せない場合があります

## CapCutが使うファイルの種類と削除の安全性`,
  },

  // 4. troubleshoot-pip：上達のコツの前に「背景削除」との組み合わせを追記
  {
    id: "troubleshoot-pip",
    label: "PiP：背景削除との組み合わせテクニックを追記",
    from: `## 上達のコツ
PiPは**メイン映像の右下**に配置するのがYouTube・ゲーム実況で最もよく使われる定番配置です。`,
    to: `## 【応用】「背景を削除」との組み合わせでプロ仕上げに
ゲーム実況・解説動画では、PiPの顔カメラ映像に**「背景を削除」**機能を組み合わせることで、四角い枠を消して**話者の体だけを画面上に浮かせる**ことができます。

- ゲーム画面を一切遮らないため、視聴者が情報を見逃しにくくなります
- 緑背景（クロマキー）がなくても、CapCutのAI背景削除でリアルタイムに背景を除去できます

**実装方法**：
1. PiPとして顔カメラ映像をオーバーレイで追加する（ステップ1〜2）
2. オーバーレイクリップを選択→**「背景を削除」**（または「クロマキー」）を適用
3. 精度が低い場合は感度スライダーで微調整、細部はマスクで補正する

## 上達のコツ
PiPは**メイン映像の右下**に配置するのがYouTube・ゲーム実況で最もよく使われる定番配置です。`,
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
