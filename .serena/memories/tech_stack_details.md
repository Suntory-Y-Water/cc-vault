# 技術スタック詳細

## フレームワーク・ライブラリ

### Core
- **Next.js**: 15.3.0 (App Router使用)
- **React**: 19.1.0 + React DOM 19.1.0
- **TypeScript**: 5.8.3

### UI・スタイリング
- **Tailwind CSS**: 3.4.17 + tailwindcss-animate
- **Radix UI**: @radix-ui/react-slot, @radix-ui/react-tabs
- **Lucide React**: アイコンライブラリ
- **class-variance-authority**: コンポーネントバリアント管理
- **clsx**: クラス名の条件付き結合
- **tailwind-merge**: Tailwindクラスのマージ

### データベース・ORM
- **LibSQL Client**: 0.15.10 (Turso用)
- **Drizzle ORM**: 0.44.4
- **Drizzle Kit**: 0.31.4 (マイグレーション)

### AI・外部API
- **Google Generative AI**: 1.12.0 (Gemini API)

### 日付・時刻処理
- **date-fns**: 4.1.0
- **date-fns-tz**: 3.2.0 (タイムゾーン対応)

### HTML解析・スクレイピング
- **linkedom**: 0.18.11 (軽量DOM実装)

### デプロイ・インフラ
- **OpenNext.js Cloudflare**: 1.6.1
- **Wrangler**: 4.26.0 (Cloudflare Workers CLI)

## 開発ツール

### コード品質
- **Biome**: 1.9.4 (リンター・フォーマッター)
- **Husky**: 9.1.7 (Git hooks)
- **lint-staged**: 15.5.2

### テスト
- **Vitest**: 3.2.4 (テストランナー)
- **@vitest/coverage-v8**: 3.2.4 (カバレッジ)
- **@testing-library/react**: 16.3.0
- **@testing-library/jest-dom**: 6.6.4
- **Happy DOM**: 17.6.3 (テスト環境)

### ビルド・ユーティリティ
- **tsx**: 4.20.3 (TypeScript実行)
- **ts-node**: 10.9.2
- **postcss**: 8.5.6
- **dotenv**: 17.2.1