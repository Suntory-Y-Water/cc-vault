# 技術スタック

## アーキテクチャ概要
CC-VaultはCloudflare Workers上で動作するサーバーレスWebアプリケーションです。Next.js App Routerを採用し、OpenNext.js Cloudflareによってエッジコンピューティング環境にデプロイされます。

## フロントエンド技術

### 🎯 コアフレームワーク
- **Next.js**: `15.5.0` (App Router使用)
- **React**: `19.1.1` + React DOM `19.1.1`
- **TypeScript**: `5.9.2` (ES2017ターゲット)

### 🎨 UI・スタイリング
- **Tailwind CSS**: `3.4.17` + tailwindcss-animate
- **Radix UI**: React Slot, React Tabs
- **Lucide React**: `0.541.0` (アイコンライブラリ)
- **Class Variance Authority**: `0.7.1` (バリアント管理)
- **clsx**: `2.1.1` + tailwind-merge `3.3.1` (クラス管理)

### 📱 レスポンシブ対応
- モバイルファーストデザイン
- タブレット・デスクトップ最適化
- アクセシビリティ対応（Radix UI基盤）

## バックエンド技術

### ☁️ ランタイム・デプロイ
- **Cloudflare Workers**: エッジコンピューティング環境
- **OpenNext.js Cloudflare**: `1.8.3` (Next.js → Workers変換)
- **Wrangler**: `4.38.0` (デプロイ・管理CLI)

### 🗃️ データベース・ORM
- **本番環境**: Cloudflare D1 (SQLiteベース)
- **開発環境**: LibSQL (Turso) `0.15.15`
- **ORM**: Drizzle ORM `0.44.5`
- **マイグレーション**: Drizzle Kit `0.31.4`

### 🤖 AI・外部API
- **Google Generative AI**: `1.20.0` (Gemini API)
- **記事解析・要約生成**: AIプロンプト最適化
- **スケジュール実行**: Cron Triggersによる自動処理

### 🕒 日付・時刻処理
- **date-fns**: `4.1.0` (軽量日付ライブラリ)
- **@date-fns/tz**: `1.4.1` (タイムゾーン対応)

### 🌐 HTML解析・スクレイピング
- **linkedom**: `0.18.12` (軽量DOM実装)
- 複数サイトの記事情報抽出に使用

## 開発環境・ツール

### 🔧 コード品質管理
- **Biome**: `1.9.4` (高速リンター・フォーマッター)
- **Husky**: `9.1.7` (Git hooks)
- **lint-staged**: `16.1.6` (ステージドファイル処理)

### 🧪 テスト環境
- **Vitest**: `3.2.4` (高速テストランナー)
- **@vitest/coverage-v8**: `3.2.4` (カバレッジ計測)
- **Testing Library/React**: `16.3.0`
- **Happy DOM**: `18.0.1` (軽量DOM環境)

### ⚡ ビルド・実行ツール
- **tsx**: `4.20.5` (TypeScript直接実行)
- **ts-node**: `10.9.2` (Node.js TypeScript実行)
- **PostCSS**: `8.5.6` (CSS処理)
- **dotenv**: `17.2.2` (環境変数管理)

## 開発コマンド

### 📋 日常的な開発作業
```bash
# 開発サーバー起動（Turbopack使用）
pnpm dev

# Cloudflareローカル開発
pnpm dev:cf

# 型チェック + Lint実行
pnpm ai-check

# テスト実行
pnpm test
pnpm test:cov
```

### 🚀 ビルド・デプロイ
```bash
# Next.jsビルド
pnpm build

# Cloudflareプレビュー
pnpm preview

# 本番デプロイ
pnpm deploy

# データベース更新込みアップロード
pnpm upload
```

### 🗄️ データベース管理
```bash
# スキーマ生成
pnpm db:generate

# マイグレーション実行
pnpm db:push

# ローカルマイグレーション
pnpm db:local
pnpm db:local:all

# Drizzle Studio起動
pnpm db:studio
```

## 環境変数

### 🔑 必須設定項目
- `GEMINI_API_KEY`: Google Gemini API認証キー
- `DATABASE_URL`: データベース接続URL
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflareアカウント ID
- `CLOUDFLARE_API_TOKEN`: Cloudflare API トークン

### 🌍 環境別設定
- **開発環境**: `.env.local` (Git除外)
- **本番環境**: Cloudflare Workers環境変数
- **型生成**: `wrangler types` コマンドで型定義自動生成

## ポート設定

### 🔌 標準ポート
- **開発サーバー**: `3000` (Next.js dev)
- **Cloudflareローカル**: `8787` (wrangler dev)
- **Drizzle Studio**: `4983` (drizzle-kit studio)

## パフォーマンス最適化

### ⚡ Next.js最適化
- App Router使用（ページルーターから移行）
- Turbopack開発ビルド（高速HMR）
- 自動コード分割・最適化

### 🌐 Cloudflare最適化
- エッジロケーション配信
- 自動スケーリング
- D1データベース低レイテンシアクセス

### 🎯 ビルド最適化
- TypeScript厳密モード
- Biomeによる高速リント・フォーマット
- 依存関係最小化（linkedom等軽量ライブラリ使用）