import {
  ArticlePaginationParams,
  ArticleRow,
  PaginatedArticles,
  SITE_VALUES,
} from '@/types';
import { drizzle } from 'drizzle-orm/d1';
import { eq, desc, count, sql, and, gte, lte } from 'drizzle-orm';
import {
  articles,
  weeklySummaries,
  weeklyReports,
} from '@/config/drizzle/schema';
import type { WeekRange } from '@/types';
import type { SiteValueType } from '@/types/article';

/**
 * D1データベースからページネーション対応で記事を取得する
 * @param db - D1データベースインスタンス
 * @param params - ページネーションパラメータ
 * @returns ページネーション情報を含む記事データ
 */
export async function getArticlesWithPagination(
  db: D1Database,
  params: ArticlePaginationParams,
): Promise<PaginatedArticles> {
  try {
    const drizzleDB = drizzle(db);
    const { page, limit, site, order } = params;
    const offset = (page - 1) * limit;

    // WHERE条件の構築
    const whereCondition =
      site && site !== 'all' ? eq(articles.site, site) : undefined;

    // ORDER BY条件の構築
    const orderCondition =
      order === 'trending'
        ? [
            desc(sql`(${articles.likes} + ${articles.bookmarks})`),
            desc(articles.publishedAt),
          ]
        : [desc(articles.publishedAt)];

    // 総件数を取得
    const countResult = await drizzleDB
      .select({ total: count() })
      .from(articles)
      .where(whereCondition);

    const totalCount = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // 記事データを取得
    const results = await drizzleDB
      .select({
        id: articles.id,
        title: articles.title,
        url: articles.url,
        author: articles.author,
        published_at: articles.publishedAt,
        likes: articles.likes,
        bookmarks: articles.bookmarks,
        site: articles.site,
      })
      .from(articles)
      .where(whereCondition)
      .orderBy(...orderCondition)
      .limit(limit)
      .offset(offset);

    const articlesData = results.map((row) => ({
      id: row.id,
      title: row.title,
      url: row.url,
      author: row.author,
      publishedAt: row.published_at,
      site: row.site,
      engagement: {
        likes: row.likes || 0,
        bookmarks: row.bookmarks || 0,
      },
    }));

    return {
      articles: articlesData,
      totalCount,
      totalPages,
      currentPage: page,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  } catch (error) {
    console.error('D1からページネーション記事の取得に失敗しました:', error);
    throw new Error(`D1からページネーション記事の取得に失敗しました: ${error}`);
  }
}

/**
 * 記事データをarticlesテーブルに保存する
 */
export async function saveArticlesToDB(params: {
  db: D1Database;
  articles: ArticleRow[];
}): Promise<void> {
  const { db, articles } = params;
  for (const article of articles) {
    try {
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO articles (
          id, title, url, author, published_at, site, likes, bookmarks, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `);

      await stmt
        .bind(
          article.id,
          article.title,
          article.url,
          article.author,
          article.published_at,
          article.site,
          article.likes,
          article.bookmarks,
        )
        .run();
    } catch (error) {
      console.error(`記事の保存に失敗しました ${article.id}:`, error);
      throw new Error(`記事の保存に失敗しました ${article.id}: ${error}`);
    }
  }
}

/**
 * 各サイトごとの過去1週間の上位3記事を取得（計9記事）
 */
export async function fetchTopArticles({
  db,
  weekRange,
}: {
  db: D1Database;
  weekRange: WeekRange;
}): Promise<ArticleRow[]> {
  try {
    const drizzleDB = drizzle(db);
    const allTopArticles: ArticleRow[] = [];

    for (const site of SITE_VALUES) {
      const results = await drizzleDB
        .select({
          id: articles.id,
          title: articles.title,
          url: articles.url,
          author: articles.author,
          published_at: articles.publishedAt,
          site: articles.site,
          likes: articles.likes,
          bookmarks: articles.bookmarks,
        })
        .from(articles)
        .where(
          and(
            eq(articles.site, site),
            gte(articles.publishedAt, `${weekRange.startDate}T00:00:00`),
            lte(articles.publishedAt, `${weekRange.endDate}T23:59:59`),
          ),
        )
        .orderBy(desc(sql`(${articles.likes} + ${articles.bookmarks})`))
        .limit(3);

      // null値をデフォルト値で置き換えて配列に追加
      const siteArticles = results.map((result) => ({
        ...result,
        likes: result.likes ?? 0,
        bookmarks: result.bookmarks ?? 0,
      }));

      allTopArticles.push(...siteArticles);
    }

    return allTopArticles;
  } catch (error) {
    throw new Error(`上位記事取得に失敗しました: ${error}`);
  }
}

/**
 * 週間要約データをweeklySummariesテーブルに保存
 */
export async function saveWeeklySummaries({
  db,
  summaries,
  weekStartDate,
}: {
  db: D1Database;
  summaries: Array<{
    articleId: string;
    summary: string;
    likesSnapshot: number;
    bookmarksSnapshot: number;
  }>;
  weekStartDate: string;
}): Promise<void> {
  try {
    const drizzleDB = drizzle(db);

    for (const summary of summaries) {
      await drizzleDB
        .insert(weeklySummaries)
        .values({
          articleId: summary.articleId,
          weekStartDate,
          summary: summary.summary,
          likesSnapshot: summary.likesSnapshot,
          bookmarksSnapshot: summary.bookmarksSnapshot,
        })
        .onConflictDoUpdate({
          target: [weeklySummaries.articleId, weeklySummaries.weekStartDate],
          set: {
            summary: summary.summary,
            likesSnapshot: summary.likesSnapshot,
            bookmarksSnapshot: summary.bookmarksSnapshot,
          },
        });
    }
  } catch (error) {
    console.error('週間要約データの保存に失敗しました:', error);
    throw new Error(`週間要約データの保存に失敗しました: ${error}`);
  }
}

/**
 * 週間レポートをweeklyReportsテーブルに保存
 */
export async function saveWeeklyReport({
  db,
  weekStartDate,
  overallSummary,
}: {
  db: D1Database;
  weekStartDate: string;
  overallSummary: string;
}): Promise<void> {
  try {
    const drizzleDB = drizzle(db);

    await drizzleDB
      .insert(weeklyReports)
      .values({
        weekStartDate,
        overallSummary,
        status: 'completed',
      })
      .onConflictDoUpdate({
        target: weeklyReports.weekStartDate,
        set: {
          overallSummary,
          status: 'completed',
        },
      });
  } catch (error) {
    console.error('週間レポートの保存に失敗しました:', error);
    throw new Error(`週間レポートの保存に失敗しました: ${error}`);
  }
}

/**
 * 指定週のウィークリーレポートデータが存在するかチェック
 * @param db - D1データベースインスタンス
 * @param weekStartDate - 週開始日 (YYYY-MM-DD形式)
 * @returns データが存在する場合true
 */
export async function hasWeeklyReportData({
  db,
  weekStartDate,
}: {
  db: D1Database;
  weekStartDate: string;
}): Promise<boolean> {
  try {
    const drizzleDB = drizzle(db);

    const result = await drizzleDB
      .select({ count: count() })
      .from(weeklyReports)
      .where(
        and(
          eq(weeklyReports.weekStartDate, weekStartDate),
          eq(weeklyReports.status, 'completed'),
        ),
      );

    return (result[0]?.count ?? 0) > 0;
  } catch (error) {
    console.error('週間レポートデータの存在確認に失敗しました:', error);
    return false; // エラー時は安全側でfalseを返す
  }
}

/**
 * 指定サイトの画面表示用週間データを取得（weeklySummariesとarticlesのINNER JOIN）
 * @param db - D1データベースインスタンス
 * @param site - サイト名
 * @param weekStartDate - 週開始日 (YYYY-MM-DD形式)
 * @returns 画面表示用の記事データ（AI要約とSnapshot値を含む）
 */
/**
 * 指定週の全体要約を取得
 */
export async function fetchWeeklyOverallSummary({
  db,
  weekStartDate,
}: {
  db: D1Database;
  weekStartDate: string;
}): Promise<string | null> {
  try {
    const drizzleDB = drizzle(db);

    const result = await drizzleDB
      .select({ overallSummary: weeklyReports.overallSummary })
      .from(weeklyReports)
      .where(
        and(
          eq(weeklyReports.weekStartDate, weekStartDate),
          eq(weeklyReports.status, 'completed'),
        ),
      )
      .limit(1);

    return result[0]?.overallSummary || null;
  } catch (error) {
    console.error('全体要約の取得に失敗しました:', error);
    return null;
  }
}

export async function fetchWeeklyDisplayData({
  db,
  site,
  weekStartDate,
}: {
  db: D1Database;
  site: SiteValueType;
  weekStartDate: string;
}): Promise<
  Array<{
    id: string;
    title: string;
    url: string;
    author: string;
    publishedAt: string;
    site: SiteValueType;
    summary: string;
    likesSnapshot: number;
    bookmarksSnapshot: number;
  }>
> {
  try {
    const drizzleDB = drizzle(db);

    const results = await drizzleDB
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
        likesSnapshot: weeklySummaries.likesSnapshot,
        bookmarksSnapshot: weeklySummaries.bookmarksSnapshot,
      })
      .from(weeklySummaries)
      .innerJoin(articles, eq(weeklySummaries.articleId, articles.id))
      .where(
        and(
          eq(weeklySummaries.weekStartDate, weekStartDate),
          eq(articles.site, site),
        ),
      )
      .orderBy(
        desc(
          sql`(${weeklySummaries.likesSnapshot} + ${weeklySummaries.bookmarksSnapshot})`,
        ),
      );

    return results.map((result) => ({
      ...result,
      publishedAt: result.publishedAt.split('T')[0], // YYYY-MM-DD形式に変換
    }));
  } catch (error) {
    console.error(`${site}の週間表示データ取得に失敗しました:`, error);
    throw new Error(`${site}の週間表示データ取得に失敗しました: ${error}`);
  }
}
