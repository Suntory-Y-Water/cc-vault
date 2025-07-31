# CC-Vault 開発コマンド

## 開発・実行コマンド
```bash
# 開発サーバー起動（Turbopack 使用）
pnpm run dev

# Cloudflare環境での開発
pnpm run dev:cf

# 本番ビルド
pnpm run build

# 本番サーバー起動
pnpm run start

# プレビュー（Cloudflare環境）
pnpm run preview

# デプロイ
pnpm run deploy

# アップロード（マイグレーション + デプロイ）
pnpm run upload
```

## 品質管理コマンド
```bash
# 型チェック
pnpm run typecheck

# リント
pnpm run lint

# リント修正
pnpm run lint:fix

# フォーマット
pnpm run format

# AI チェック（型チェック + リント）
pnpm run ai-check
```

## テストコマンド
```bash
# テスト実行
pnpm run test

# テスト（カバレッジ付き）
pnpm run test:cov
```

## データベースコマンド
```bash
# D1データベース作成
pnpm run db:create

# マイグレーション実行
pnpm run db:migrate

# Cloudflare型定義生成
pnpm run typegen
```

## スケジュールテスト
```bash
# スケジュールタスクのテスト
pnpm run schedule
```

## システムコマンド（Linux）
```bash
# ファイル一覧
ls -la

# ディレクトリ移動
cd <directory>

# 検索
grep -r "pattern" src/

# ファイル検索
find . -name "*.ts" -type f

# Git操作
git status
git add .
git commit -m "message"
git push
```