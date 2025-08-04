# ウィークリーレポート機能 詳細要件定義書

## システム概要
- **目的**: 「先週、どんなことあったっけ？」を振り返るための週次人気記事レポート機能
- **対象サイト**: Zenn、Qiita、はてなブックマーク
- **実行タイミング**: 毎週月曜日UTC午後3時（日本時間午前0時）
- **Cron設定**: `0 15 * * 0` (日曜日のUTC15時 = 月曜日JST00時)
- **記事選定基準**: 各サイトごとにいいね数+ブックマーク数の上位3記事（計9記事）

## 技術的詳細

### Cron実行時間の計算
- 日本時間: 月曜日 00:00 JST
- UTC時間: 日曜日 15:00 UTC (JST-9時間)
- Cloudflare Workers Cron: `0 15 * * 0` (日曜日のUTC15時)

### データベース設計（Drizzle ORM使用）

#### 既存テーブル活用方針
- articlesテーブルから基本情報を取得（title, url, author, publishedAt, site）
- INNER JOINで結合してデータを取得
- likes, bookmarksの値は処理実行時点のSnapshotとして保存

#### 新規テーブル: weekly_summaries
```typescript
export const weeklySummaries = sqliteTable('weekly_summaries', {
  articleId: text('article_id').primaryKey().references(() => articles.id),
  weekStartDate: text('week_start_date').notNull(), // 'YYYY-MM-DD'
  summary: text('summary').notNull(),
  // 処理実行時点のSnapshot値
  likesSnapshot: integer('likes_snapshot').notNull(),
  bookmarksSnapshot: integer('bookmarks_snapshot').notNull(),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
}, (table) => [
  unique().on(table.articleId, table.weekStartDate),
  index('idx_weekly_summaries_week').on(table.weekStartDate),
]);
```

#### 新規テーブル: weekly_reports
```typescript
export const weeklyReports = sqliteTable('weekly_reports', {
  weekStartDate: text('week_start_date').primaryKey(), // ユニークなので主キーとして使用
  overallSummary: text('overall_summary').notNull(),
  status: text('status', { enum: ['processing', 'completed', 'failed'] }).notNull(),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
}, (table) => [
  index('idx_weekly_reports_status').on(table.status),
]);
```

### SQL クエリ設計の違い

#### 1. バッチ処理用クエリ（必要フィールドのみ選択）
```typescript
// 目的: 記事データ取得 + 要約生成用
// 特徴: articlesテーブルのみ、必要最小限のフィールド
const batchQuery = db
  .select({
    id: articles.id,
    title: articles.title,
    url: articles.url,
    author: articles.author,
    publishedAt: articles.publishedAt,
    site: articles.site,
    likes: articles.likes,        // 実行時点のリアルタイム値
    bookmarks: articles.bookmarks, // 実行時点のリアルタイム値
  })
  .from(articles)
  .where(
    and(
      eq(articles.site, site),
      gte(articles.publishedAt, weekRange.startDate),
      lte(articles.publishedAt, weekRange.endDate)
    )
  )
  .orderBy(desc(sql`(${articles.likes} + ${articles.bookmarks})`))
  .limit(3);
```

#### 2. 画面表示用クエリ（INNER JOIN使用）
```typescript
// 目的: 画面表示用データ取得
// 特徴: 2テーブル結合、Snapshot値 + 要約データ
const displayQuery = db
  .select({
    // articles テーブルから（基本情報）
    id: articles.id,
    title: articles.title,
    url: articles.url,
    author: articles.author,
    publishedAt: articles.publishedAt,
    site: articles.site,
    // weekly_summaries テーブルから（処理結果）
    summary: weeklySummaries.summary,
    likesSnapshot: weeklySummaries.likesSnapshot,     // 処理時点の固定値
    bookmarksSnapshot: weeklySummaries.bookmarksSnapshot, // 処理時点の固定値
  })
  .from(weeklySummaries)
  .innerJoin(articles, eq(weeklySummaries.articleId, articles.id))
  .where(eq(weeklySummaries.weekStartDate, targetWeekStartDate))
  .orderBy(desc(sql`(${weeklySummaries.likesSnapshot} + ${weeklySummaries.bookmarksSnapshot})`));
```

#### クエリの主な違い
1. **データソース**: バッチ処理=articles単体、画面表示=2テーブル結合
2. **likes/bookmarks**: バッチ処理=リアルタイム値、画面表示=Snapshot値
3. **追加データ**: 画面表示のみAI要約（summary）を含む
4. **用途**: バッチ処理=データ収集、画面表示=表示専用

## バッチ処理フロー（custom-worker.ts）
```typescript
// 重要: 日付処理はJST基準で実行
import { utcToZonedTime } from 'date-fns-tz';

// UTCの実行時刻をJSTに変換
const executionDateUTC = new Date(); // UTC時刻
const executionDateJST = utcToZonedTime(executionDateUTC, 'Asia/Tokyo'); // JST変換
const weekRange = calculatePreviousWeek(executionDateJST); // JST基準で週計算

// 処理フロー
1. 週範囲計算（前週月曜〜日曜、JST基準）
2. 各サイトごとの記事取得（Drizzle ORM）
3. 記事本文取得（既存 src/lib/parser.ts 活用）
4. AI要約生成（既存 src/lib/prompts.ts + Gemini 2.0 Flash Lite）
5. weekly_summaries テーブル保存
6. 全体総括文章生成（Gemini 2.0 Flash Lite）
7. weekly_reports テーブル保存
```

## 年度・日付の明確化
- **開発基準日**: 2025年8月3日（日）
- **サンプル週**: 2025年7月28日〜2025年8月3日の記事が対象
- **バッチ実行日**: 2025年8月5日（月）午前0時JST
- **重要**: 2024年ではなく2025年が対象年
- **タイムゾーン**: 全ての日付処理はJST（Asia/Tokyo）基準

## 画面表示仕様
- **URL**: `/weekly-report`
- **初期表示**: 最新完成週（データ存在する最新週）
- **週ナビゲーション**: 
  - 前の週: DBにデータ存在時のみ有効
  - 次の週: 現在週より未来は無効
- **表示データ**: 既存UIコンポーネント（src/components/weekly-report/TopArticles.tsx）活用
- **AI要約表示**: 各記事カードのAI要約セクションでweeklySummaries.summaryを表示

## ファイル構成（機能別適切配置）
```
src/
├── lib/
│   ├── weekly-report.ts          # 既存（週計算ユーティリティ）
│   ├── cloudflare.ts            # 既存DB操作 + 新規関数追加
│   ├── parser.ts                # 既存（記事本文取得）
│   └── prompts.ts               # 既存（AI要約プロンプト）
├── app/weekly-report/
│   └── page.tsx                  # 既存（表示画面）
├── components/weekly-report/
│   └── TopArticles.tsx          # 既存（UI表示）
└── config/drizzle/
    └── schema.ts                 # テーブル定義追加
```

## 機能要件詳細

### Cron Job処理要件
- custom-worker.ts で指定時間に正常動作すること
- 各サイト(Zenn, Qiita, はてなブックマーク)の上位3記事取得
- 取得範囲は過去1週間のpublishedAtが対象
- SQLでGroupBy、ORDER Byを活用し、画面側での並び替えを最小化
- **日付処理**: date-fns-tzでUTCからJSTに変換して週計算

### 処理フロー要件
1. バッチ起動（JST基準の日付計算）
2. 各サイトごとのレコード取得
3. 既存 src/lib/parser.ts で記事本文取得
4. 既存 src/lib/prompts.ts のプロンプトでGemini 2.0 Flash Liteに要約依頼
5. サイトごとに繰り返し
6. weekly_summaries テーブル保存（likes/bookmarksのSnapshot含む）
7. 要約記事の総括文章をGemini 2.0 Flash Liteで作成
8. weekly_reports テーブル保存

### 画面表示要件
- 画面初期表示時にDBアクセスして該当週データ表示
- URL例: http://localhost:3000/weekly-report
- 初期表示は常に最新の週
- 例: 2025年8月3日なら2025-07-21から2025-07-27のデータ
- 初期表示時点で「次の週」ボタンは押下不可
- 過去週はDBにデータがある場合に「前の週」ボタンが押下可能
- TopArticles.tsx のgetAISummary()をweeklySummaries.summaryに置き換え
- likes/bookmarksはSnapshot値（likesSnapshot/bookmarksSnapshot）を表示