# 週次記事収集スクリプト実装ドキュメント

## 現在の状況

### 完成済み機能 ✅
- [x] D1データベースアクセス機能（REST API経由）
- [x] 記事本文解析機能
- [x] 型定義とビジネスロジック分離
- [x] 週次記事収集スクリプトの完全実装
- [x] 環境変数を使用したD1アクセス（getCloudflareContext問題解決済み）

### 実装ファイル
- `src/scripts/generate-weekly-articles.ts` - メインスクリプト
- `src/types/weekly-report.ts` - 型定義（WeeklyProcessingArticle, WeeklyProcessingInput）
- `src/lib/weekly-report.ts` - 週番号計算機能（calculateWeekNumber）
- `src/lib/cloudflare.ts` - D1アクセス機能
- `src/lib/parser.ts` - 記事本文解析機能

### スクリプト実行方法
```bash
# 環境変数設定（.env.local）
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_DATABASE_ID=your-database-id
CLOUDFLARE_D1_TOKEN=your-api-token

# 実行コマンド
npx tsx src/scripts/generate-weekly-articles.ts 2025-07-14 2025-07-20
```

### 出力データ形式
```json
{
  "weekRange": {
    "startDate": "2025-07-14",
    "endDate": "2025-07-20",
    "weekNumber": 29
  },
  "articles": [
    {
      "id": "zenn-article-id",
      "title": "記事タイトル",
      "url": "https://zenn.dev/path/to/article",
      "author": "著者名",
      "publishedAt": "2025-07-20",
      "content": "記事本文テキスト...",
      "likes": 150,
      "bookmarks": 80,
      "ranking": 1
    }
  ]
}
```

## 次のアクション（別のAIが実装）

### 1. 最終週次レポートJSON生成機能 【優先度：高】
- **目的**: AI要約処理後の最終JSONファイル生成
- **入力**: `WeeklyProcessingInput` + AI要約結果
- **出力**: 静的配信用の週次レポートJSON（`src/data/weekly-report/YYYY-MM-DD.json`）
- **必要な処理**:
  - AI要約データとの統合
  - 最終JSON構造への変換
  - ファイル出力機能

<!-- TODO: ここの記載誤っている -->
### 2. GitHub Actions統合 【優先度：高】
- **目的**: 週次自動実行の仕組み構築
- **必要な作業**:
  - `.github/workflows/weekly-report.yml`の作成
  - 毎週月曜日00:00 JSTの実行スケジュール設定
  - 環境変数の設定
  - Claude Code APIとの連携処理
  - プルリクエスト自動作成

### 3. データディレクトリ構造の整備 【優先度：中】
- **作成必要**:
  - `src/data/weekly-report/`ディレクトリ
  - 週次レポートファイルの命名規則（YYYY-MM-DD.json）
  - インデックスファイルまたは一覧取得機能

## 技術的制約・注意事項

### 環境変数要件
```bash
CLOUDFLARE_ACCOUNT_ID    # CloudflareアカウントID
CLOUDFLARE_DATABASE_ID   # D1データベースID  
CLOUDFLARE_D1_TOKEN      # CloudflareのAPIトークン
```

### データ制約
- 初期実装はZennサイトのみ対象
- 記事本文取得は各記事URLから個別取得（処理時間考慮）
- ランキング計算は（likes + bookmarks）の合計値

### 処理フロー
1. D1データベースから指定期間の記事取得（REST API）
2. Zennサイトの記事のみフィルタリング
3. 各記事URLから本文コンテンツ取得
4. 週次処理用JSON形式で出力
5. **[次のAI担当]** AI要約処理との連携
6. **[次のAI担当]** 最終JSON生成と静的ファイル出力

## 関連ドキュメント

- [009_weekly_report_generation.md](./009_weekly_report_generation.md) - 週次レポート生成機能全体仕様
- [007_cc-vault-db.md](./007_cc-vault-db.md) - データベース設計
- [008_opennext_worker_scheduling.md](./008_opennext_worker_scheduling.md) - スケジュール実行設定