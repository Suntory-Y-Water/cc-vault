# ウィークリーレポート生成機能仕様書

## システム概要

Claude Code関連記事のウィークリーレポートを自動生成する機能。Cloudflare D1データベースから記事データを取得し、記事本文の解析とAI要約を経て、静的JSONファイルを生成する。

## データフロー

### 処理順序

1. D1データベースから指定週の記事データを取得
2. 各記事URLから本文コンテンツを取得
3. 記事データを整形してClaude Code処理用JSONを生成
4. GitHub ActionsでClaude Codeによる要約処理
5. 最終的な週次レポートJSONファイルを出力
6. プルリクエストによる静的ファイル更新

### データ変換

```
D1 Articles Table -> Raw Article Data -> Content Parsed Data -> AI Summary JSON -> Static Weekly Report
```

## 実行タイミング

### スケジュール設定

- 実行日時：毎週月曜日 JST 00:00
- 対象期間：前週月曜日から日曜日までの7日間
- ファイル命名：週開始日の月曜日（yyyy-mm-dd形式）

### 実行例

- 本日2025年7月24日時点
- 最新レポート期間：2025年7月14日〜2025年7月20日
- 出力ファイル：`src/data/weekly-report/2025-07-14.json`
- 次回実行：2025年7月28日月曜日00:00
- 次回出力：`src/data/weekly-report/2025-07-21.json`

## ファイル構成

### 出力ディレクトリ

```
src/data/weekly-report/
├── 2025-07-14.json
├── 2025-07-21.json
├── 2025-07-28.json
└── ...
```

### 中間処理ファイル

GitHub Actions実行時に生成される一時ファイル
- Claude Code処理用入力JSON
- 要約処理後の出力JSON

## データ仕様

### D1データベース取得条件

```sql
SELECT id, title, url, author, published_at, site, likes, bookmarks
FROM articles 
WHERE site = 'zenn' 
  AND published_at >= '2025-07-14' 
  AND published_at <= '2025-07-20'
ORDER BY (likes + bookmarks) DESC
```

### Claude Code処理用入力JSON構造

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
      "content": "記事本文テキスト",
      "likes": 150,
      "bookmarks": 80,
      "ranking": 1
    }
  ]
}
```

### 最終出力JSON構造

```json
{
  "weekRange": {
    "startDate": "2025-07-14",
    "endDate": "2025-07-20",
    "weekNumber": 29,
  },
  "generatedAt": "2025-07-21T00:00:00.000Z",
  "topArticles": [
    {
      "id": "zenn-article-id",
      "title": "記事タイトル",
      "url": "https://zenn.dev/path/to/article",
      "author": "著者名",
      "publishedAt": "2025-07-20",
      "site": "zenn",
      "aiSummary": "Claude Codeによる要約文",
      "engagement": {
        "likes": 150,
        "bookmarks": 80,
        "total": 230
      },
      "weeklyRank": 1
    }
  ]
}
```

## 実装要件

### 必要な新規実装

1. 週次データ取得機能
   - ファイル：`src/lib/weekly-report.ts`拡張
   - D1から指定期間のZenn記事取得

2. 記事本文取得機能
   - ファイル：`src/lib/parser.ts`拡張
   - ZennのHTML構造解析
   - 本文テキスト抽出

3. JSON生成機能
   - 中間JSON生成（Claude Code処理用）
   - 最終JSON生成（静的配信用）

4. 週次実行スクリプト
   - 上記機能を統合した実行可能スクリプト
   - エラーハンドリング

### 既存機能との統合

- `src/lib/cloudflare.ts`：D1接続機能を利用
- `src/lib/fetchers.ts`：HTML取得機能を利用
- `custom-worker.ts`：Cloudflare Workers Scheduled機能を拡張

## 制約事項

### Cloudflare環境制約

- Node.js `fs`モジュール使用不可
- 静的ファイル読み込みは`fetch`経由で実装
- Worker実行時間制限内での処理完了

### データ制約

- 初期実装はZennサイトのみ対象
- 記事本文取得はTODO実装（仮データ返却）
- ランキング計算は（いいね数＋ブックマーク数）の合計値

### GitHub Actions制約

- Claude Code APIの利用制限
- 実行時間制限
- 処理対象記事数の上限設定