# 推奨コマンド一覧

## 開発コマンド

### 基本開発
- `pnpm dev`: 開発サーバー起動（Turbopack使用）
- `pnpm dev:cf`: Cloudflare環境での開発サーバー起動

### ビルド・デプロイ
- `pnpm build`: 本番ビルド
- `pnpm start`: 本番サーバー起動
- `pnpm preview`: Cloudflareプレビュー
- `pnpm deploy`: Cloudflareデプロイ
- `pnpm upload`: DBマイグレーション後にアップロード

### コード品質
- `pnpm typecheck`: TypeScript型チェック
- `pnpm lint`: Biomeリンター実行
- `pnpm lint:fix`: リンター自動修正
- `pnpm format`: Biomeフォーマッター実行
- `pnpm ai-check`: 型チェック＋リンター（AI開発用）

### テスト
- `pnpm test`: テスト実行
- `pnpm test:cov`: カバレッジ付きテスト実行

### データベース
- `pnpm db:generate`: Drizzleスキーマ生成
- `pnpm db:push`: スキーマをDBにプッシュ
- `pnpm db:studio`: Drizzle Studio起動
- `pnpm db:local`: ローカルマイグレーション（latest）
- `pnpm db:local:all`: ローカルマイグレーション（all）
- `pnpm db:backup:prod`: 本番DBバックアップ

### Cloudflare
- `pnpm typegen`: Cloudflare型定義生成
- `pnpm schedule`: スケジュールワーカーのテスト

## Git・CI/CD
- `pnpm prepare`: Huskyセットアップ

## Kiro仕様駆動開発コマンド
- `/kiro:steering`: ステアリングドキュメント作成・更新
- `/kiro:spec-init [description]`: 新規仕様初期化
- `/kiro:spec-requirements [feature]`: 要件ドキュメント生成
- `/kiro:spec-design [feature]`: 技術設計作成
- `/kiro:spec-tasks [feature]`: 実装タスク生成
- `/kiro:spec-status [feature]`: 仕様進捗確認

## システムコマンド（Linux）
- `ls`: ファイル一覧
- `cd`: ディレクトリ移動
- `grep`: 文字列検索
- `find`: ファイル検索
- `git`: バージョン管理