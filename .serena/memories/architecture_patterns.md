# アーキテクチャパターン

## Next.js App Router構成

### ページ構造
- `src/app/`: App Routerによるファイルベースルーティング
- `layout.tsx`: 共通レイアウト
- `page.tsx`: ページコンポーネント
- `error.tsx`: エラーハンドリング
- `not-found.tsx`: 404ページ

### 機能別ディレクトリ
- `src/app/features/`: 主要機能
- `src/app/search/`: 検索機能
- `src/app/weekly-report/`: レポート機能

## コンポーネント設計

### UI コンポーネント（shadcn/ui）
- `src/components/`: 再利用可能なUIコンポーネント
- Radix UIベースの高品質コンポーネント
- Tailwind CSSによるスタイリング

### 設定管理
- `src/config/`: アプリケーション設定
- `ai-agents.ts`: AIエージェント設定
- `site.ts`: サイト共通設定

## データベース設計

### Drizzle ORM
- `src/config/drizzle/schema.ts`: スキーマ定義
- `src/config/drizzle/migrations/`: マイグレーションファイル
- SQLite（D1）データベース使用

## Cloudflare統合

### OpenNext.js Adapter
- Next.jsアプリケーションのCloudflare Workers適応
- Edge Runtimeでの実行最適化
- 静的ファイルのCloudflare Pages配信

### Environment Variables
- `.env`: ローカル開発環境変数
- `.env.example`: 環境変数テンプレート
- Cloudflare環境変数との連携

## 開発ワークフロー

### Kiro仕様駆動開発
- `.kiro/steering/`: プロジェクト指針
- `.kiro/specs/`: 機能仕様書
- 要件→設計→タスク→実装の段階的プロセス

### Claude Code統合
- `.claude/commands/`: カスタムコマンド
- スラッシュコマンドによる開発効率化
- AIエージェントとの協調開発