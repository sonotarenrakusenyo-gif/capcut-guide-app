# 🎬 CapCut完全攻略アプリ

> **SNS動画編集の質を爆速で上げる、全66記事の学習ロードマップアプリ**

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://capcut-guide-app.vercel.app)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite)](https://vitejs.dev)

---

## 📖 概要

**CapCut完全攻略アプリ**は、動画編集初心者から上級者まで幅広く対応した学習プラットフォームです。

CapCutの基本操作から、YouTube向けの高度なテクニック、トラブル対処法まで、**全66記事**を4つのカテゴリーに体系化。スマートフォンでも快適に読める設計で、学習の進捗をブラウザに保存しながら自分のペースで学べます。

🌐 **公開URL**: [https://capcut-guide-app.vercel.app](https://capcut-guide-app.vercel.app)

---

## ✨ 主な機能

### 📚 4カテゴリー × 66記事の体系的学習

| カテゴリー | 記事数 | 内容 |
|---|---|---|
| 🔵 基本操作 | 15記事 | プロジェクト作成・タイムライン・エクスポートなど |
| 🔴 YouTube実践 | 18記事 | Shorts最適化・サムネイル・ジャンプカットなど |
| 🟡 トラブル解決 | 18記事 | 動画が重い・音ズレ・書き出し失敗など |
| 🟣 高度な応用 | 15記事 | カラーグレーディング・キーフレーム・マスクなど |

### 💡 画像付きメインステップ（20記事）のハイライト

特に重要な20記事には **Gemini生成の解説画像** と `💡解説画像あり` バッジを表示。
視覚的に学習ポイントを把握できます。

### 📊 学習進捗の完全管理

- **ロードマップ画面**で全66記事を一覧表示
- 各記事を「完了にする」でチェック ✅
- 進捗は `localStorage` に保存 → **リロードしても消えない**
- カテゴリー別の完了率バーをホーム画面に表示
- **全66記事完走で紙吹雪の祝福アニメーション 🎉**

### 🔍 スマート検索

- カタカナ・ひらがな両対応の全文検索
- 検索結果ゼロ時は「こちらの記事はいかがですか？」サジェスト表示
- 最近の検索キーワード履歴機能

### 📱 UX・読みやすさへのこだわり

- **スクロール進捗バー**（記事ページ最上部に表示）
- **ダーク / ライトモード**切り替え（設定をlocalStorageに保存）
- **最近読んだ記事**の履歴をマイページに表示
- スマホで押しやすい大きめボタン設計
- どのページからでも迷わず戻れるナビゲーション

---

## 🛠️ 技術スタック

| 分類 | 技術 |
|---|---|
| フロントエンド | React 18 + TypeScript |
| ビルドツール | Vite 5 |
| ルーティング | Wouter |
| スタイリング | CSS変数（ダーク/ライトテーマ対応）+ インラインスタイル |
| データ管理 | JSONファイル + localStorage |
| アイコン | Lucide React |
| Markdown描画 | Streamdown |
| ホスティング | Vercel（GitHub連携による自動デプロイ） |

---

## 🚀 ローカル起動方法

```bash
# リポジトリをクローン
git clone https://github.com/sonotarenrakusenyo-gif/capcut-guide-app.git
cd capcut-guide-app

# 依存パッケージをインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで `http://localhost:5173` を開くと起動します。

```bash
# 本番ビルド
npm run build

# ビルド結果をプレビュー
npm run preview
```

---

## 📁 ディレクトリ構成

```
capcut-guide-app/
├── public/
│   └── images/          # 解説画像（img-01.png〜img-20.png）
├── src/
│   ├── components/ui/   # 共通UIコンポーネント（Button, Card, Input等）
│   ├── contexts/        # ThemeContext（ダーク/ライトモード管理）
│   ├── data/            # articles-data.json（全66記事データ）
│   ├── lib/             # trpc.ts / localEngagement.ts / searchNormalize.ts
│   └── pages/           # 各ページコンポーネント
│       ├── Home.tsx         # トップページ
│       ├── CategoryPage.tsx # カテゴリー別記事一覧
│       ├── ArticleDetail.tsx# 記事詳細ページ
│       ├── Roadmap.tsx      # 学習ロードマップ
│       ├── MyPage.tsx       # マイページ（進捗・履歴・お気に入り）
│       ├── SearchResults.tsx# 検索結果ページ
│       └── Favorites.tsx    # お気に入り一覧
├── vercel.json          # Vercelデプロイ設定
└── package.json
```

---

## 🤖 開発プロセス：AIとの共同制作

このアプリは **最新AIの分業体制** によって短期間で構築されました。

| 役割 | AI | 担当 |
|---|---|---|
| 🧠 **軍師（戦略・コンテンツ）** | Google Gemini | 全66記事の内容精査・改善提案・解説画像プロンプト生成 |
| 🔨 **職人（実装）** | Cursor / Claude | コーディング・機能実装・バグ修正・デプロイ |

Geminiによる記事レビュー → Claude/Cursorによる即実装 → Vercel自動デプロイ、というサイクルで開発を加速。**企画から公開まで短期間での完成**を実現しました。

---

## 📄 ライセンス

このプロジェクトは個人学習・ポートフォリオ用途で公開しています。
記事コンテンツの無断転載はご遠慮ください。

---

<div align="center">

**🎬 CapCutをマスターして、あなたの動画を次のレベルへ 🚀**

[アプリを開く →](https://capcut-guide-app.vercel.app)

</div>
