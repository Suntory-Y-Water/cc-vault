# 推奨コマンド一覧

## 開発コマンド

### 起動・ビルド
```bash
# 開発サーバー起動（Turbopack使用）
pnpm run dev

# Cloudflare Workers環境での開発
pnpm run dev:cf

# プロダクションビルド
pnpm run build

# プロダクションサーバー起動
pnpm run start

# プレビュー（Cloudflare環境）
pnpm run preview
```

### コード品質チェック
```bash
# 型チェック + リント実行（AI推奨コマンド）
pnpm run ai-check

# 型チェックのみ
pnpm run typecheck

# リント実行
pnpm run lint

# リント + 自動修正
pnpm run lint:fix

# コードフォーマット
pnpm run format
```

### テスト
```bash
# テスト実行（ウォッチモード）
pnpm run test

# カバレッジ付きテスト実行
pnpm run test:cov
```

### データベース
```bash
# マイグレーション生成
pnpm run db:generate

# データベースにスキーマを適用
pnpm run db:push

# Drizzle Studio起動（GUI）
pnpm run db:studio

# ローカルマイグレーション実行
pnpm run db:local

# 全てのローカルマイグレーション実行
pnpm run db:local:all

# 本番データベースバックアップ
pnpm run db:backup:prod
```

### Cloudflare Workers
```bash
# 型定義生成
pnpm run typegen

# スケジュールテスト
pnpm run schedule

# デプロイ
pnpm run deploy

# アップロード（マイグレーション + デプロイ）
pnpm run upload
```

### Git・品質管理
```bash
# Huskyセットアップ
pnpm run prepare

# 手動でlint-staged実行
npx lint-staged
```

## 開発フロー
1. `pnpm run dev` で開発サーバー起動
2. コード変更後 `pnpm run ai-check` で品質チェック
3. テスト作成・実行: `pnpm run test`
4. コミット前に自動でlint-stagedが実行される
5. デプロイ: `pnpm run deploy`

## よく使う Linux コマンド
- `ls` - ファイル一覧
- `cd` - ディレクトリ移動  
- `grep` - テキスト検索
- `find` - ファイル検索
- `git` - バージョン管理