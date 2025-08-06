# タスク完了時のチェックリスト

## 必須チェック項目

### 1. コード品質チェック
```bash
# 必須実行コマンド
pnpm run ai-check
```
このコマンドは以下を実行:
- `pnpm run typecheck` - TypeScript型チェック
- `pnpm run lint` - Biomeリント

### 2. テスト実行
```bash
# テスト実行（カバレッジ付き）
pnpm run test:cov
```

### 3. ビルド確認
```bash
# プロダクションビルドが通ることを確認
pnpm run build
```

## コード変更時の追加チェック

### データベーススキーマ変更時
```bash
# マイグレーション生成
pnpm run db:generate

# ローカルで確認
pnpm run db:local
```

### 新機能・コンポーネント追加時
- JSDocコメントの追加確認
- 型定義の適切な配置確認
- コンポーネントのプロップス型定義確認

### UI変更時
```bash
# フォーマット確認
pnpm run format
```

## デプロイ前確認

### Cloudflare Workers環境確認
```bash
# Cloudflare環境でのテスト
pnpm run dev:cf

# プレビュー確認
pnpm run preview
```

### 型定義更新
```bash
# Cloudflare環境の型定義生成
pnpm run typegen
```

## 完了基準

### ✅ 成功条件
- `pnpm run ai-check` エラーなし
- `pnpm run test:cov` 全テスト通過
- `pnpm run build` 成功
- 機能が期待通りに動作

### ❌ 失敗時の対応
1. エラーメッセージを確認
2. 該当箇所を修正
3. 再度チェックリストを実行
4. 必要に応じてテスト追加

## Git コミット前
- Huskyによる自動実行:
  - lint-staged（変更ファイルの品質チェック）
- 手動確認推奨:
  - コミットメッセージの妥当性
  - 変更内容の整合性