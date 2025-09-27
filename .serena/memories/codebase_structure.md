# コードベース構造

## ルートディレクトリ構成

### プロジェクト設定
- `package.json`: プロジェクト依存関係とスクリプト
- `tsconfig.json`: TypeScript設定
- `next.config.ts`: Next.js設定
- `biome.json`: リンター・フォーマッター設定
- `vitest.config.mts`: テスト設定
- `drizzle.config.ts`: データベース設定
- `tailwind.config.ts`: TailwindCSS設定

### 開発・デプロイ設定
- `.devcontainer/`: 開発コンテナ設定
- `.husky/`: Gitフック設定
- `wrangler.jsonc`: Cloudflare設定
- `open-next.config.ts`: OpenNext.js設定

### Kiro仕様駆動開発
- `.kiro/steering/`: プロジェクト全体のガイダンス
- `.kiro/specs/`: 機能別仕様書
- `.claude/commands/`: Claudeコマンド定義

## srcディレクトリ構成

### アプリケーション構造
- `src/app/`: Next.js App Router（ページ・レイアウト）
  - `features/`: 機能別ページ
  - `search/`: 検索機能
  - `weekly-report/`: ウィークリーレポート
  - `help/`, `privacy/`, `terms/`: 静的ページ
- `src/components/`: 再利用可能なUIコンポーネント
- `src/lib/`: ユーティリティ・ヘルパー関数
- `src/config/`: 設定ファイル
  - `drizzle/`: データベーススキーマ・マイグレーション
  - `ai-agents.ts`: AIエージェント設定
  - `site.ts`: サイト設定
- `src/types/`: TypeScript型定義
- `src/tests/`: テストファイル

### パスエイリアス
- `@/*`: `./src/*` へのエイリアス設定