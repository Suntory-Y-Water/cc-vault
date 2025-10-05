import {
  ArticlePaginationParams,
  ArticleRow,
  PaginatedArticles,
  SearchParams,
  SITE_VALUES,
} from '@/types';
import type { AIAgentType } from '@/types/article';
import { drizzle } from 'drizzle-orm/d1';
import { eq, desc, count, sql, and, gte, lte } from 'drizzle-orm';
import {
  articles,
  weeklySummaries,
  weeklyReports,
} from '@/config/drizzle/schema';
import type { SiteRanking, WeekRange } from '@/types';
import type { SiteValueType } from '@/types/article';
import { getCurrentJSTDateTimeString } from './weekly-report';

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
    const { page, limit, site, order, aiAgent } = params;
    const offset = (page - 1) * limit;

    // WHERE条件の構築
    const whereConditions = [];

    if (site && site !== 'all') {
      whereConditions.push(eq(articles.site, site));
    }

    if (aiAgent && aiAgent !== 'all') {
      whereConditions.push(eq(articles.aiAgent, aiAgent));
    }

    const whereCondition =
      whereConditions.length > 0
        ? whereConditions.length === 1
          ? whereConditions[0]
          : and(...whereConditions)
        : undefined;

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
    logger.error(
      { params, error },
      'D1からページネーション記事の取得に失敗しました',
    );
    throw new Error(`D1からページネーション記事の取得に失敗しました: ${error}`);
  }
}

/**
 * 検索条件に基づいて記事を取得する関数
 *
 * 事前条件:
 * - queryが空文字列でない場合、有効な検索キーワードであること
 * - pageは1以上の整数であること
 * - limitは1以上の整数であること
 *
 * 事後条件:
 * - 検索結果が要件に合致する記事のみを含むこと
 * - ページネーション情報が正確であること
 */
/**
 * タイトル検索条件に基づいて記事を取得する関数
 */
import { getLogger } from '@/lib/logger';

const logger = getLogger();

export async function fetchArticlesByTitle(params: {
  db: D1Database;
  searchParams: SearchParams;
}): Promise<PaginatedArticles> {
  const {
    db,
    searchParams: { page, limit, site, order, query, aiAgent },
  } = params;

  if (page < 1) {
    throw new Error('Invalid page parameter: must be greater than 0');
  }
  if (limit < 1) {
    throw new Error('Invalid limit parameter: must be greater than 0');
  }

  try {
    const drizzleDB = drizzle(db);
    const offset = (page - 1) * limit;

    // WHERE条件の構築
    const conditions = [];

    // サイトフィルタ
    if (site && site !== 'all') {
      conditions.push(eq(articles.site, site));
    }

    // AIエージェントフィルタ
    if (aiAgent && aiAgent !== 'all') {
      conditions.push(eq(articles.aiAgent, aiAgent));
    }

    // 検索条件（タイトルのLIKE検索、大文字小文字区別なし）
    if (query) {
      conditions.push(
        sql`${articles.title} LIKE ${'%' + query + '%'} COLLATE NOCASE`,
      );
    }

    const whereCondition =
      conditions.length > 0
        ? conditions.length === 1
          ? conditions[0]
          : and(...conditions)
        : undefined;

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
    logger.error({ params, error }, '記事検索に失敗しました');
    throw new Error(`記事検索に失敗しました: ${error}`);
  }
}

/**
 * 記事データをarticlesテーブルに保存する
 */
export async function saveArticlesToDB(params: {
  db: D1Database;
  articles: ArticleRow[];
}): Promise<void> {
  const { db, articles: articleList } = params;

  if (articleList.length === 0) return;

  const drizzleDB = drizzle(db);
  const now = getCurrentJSTDateTimeString();

  // 各記事を個別に処理し、エラー時も継続
  for (const article of articleList) {
    try {
      await drizzleDB
        .insert(articles)
        .values({
          id: article.id,
          title: article.title,
          url: article.url,
          author: article.author,
          publishedAt: article.published_at,
          site: article.site,
          aiAgent: article.ai_agent,
          likes: article.likes,
          bookmarks: article.bookmarks,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: [articles.url, articles.aiAgent],
          set: {
            title: article.title,
            author: article.author,
            publishedAt: article.published_at,
            likes: article.likes,
            bookmarks: article.bookmarks,
            updatedAt: now,
          },
        });
    } catch (error) {
      logger.error(
        { articleId: article.id, error, articleUrl: article.url },
        '記事保存でエラーが発生しました',
      );
    }
  }
}

/**
 * 各サイトごとの過去1週間の上位3記事を取得（計9記事）
 */
export async function fetchTopArticles({
  db,
  weekRange,
  aiAgent,
}: {
  db: D1Database;
  weekRange: WeekRange;
  aiAgent?: AIAgentType;
}): Promise<ArticleRow[]> {
  try {
    const drizzleDB = drizzle(db);
    const allTopArticles: ArticleRow[] = [];

    for (const site of SITE_VALUES) {
      const whereConditions = [
        eq(articles.site, site),
        gte(articles.publishedAt, `${weekRange.startDate}T00:00:00`),
        lte(articles.publishedAt, `${weekRange.endDate}T23:59:59`),
      ];

      if (aiAgent) {
        whereConditions.push(eq(articles.aiAgent, aiAgent));
      }

      const results = await drizzleDB
        .select({
          id: articles.id,
          title: articles.title,
          url: articles.url,
          author: articles.author,
          published_at: articles.publishedAt,
          site: articles.site,
          ai_agent: articles.aiAgent,
          likes: articles.likes,
          bookmarks: articles.bookmarks,
        })
        .from(articles)
        .where(and(...whereConditions))
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
    logger.error(
      { weekStartDate, error },
      '週次要約データの保存に失敗しました',
    );
    throw new Error(`週次要約データの保存に失敗しました: ${error}`);
  }
}

/**
 * 週間レポートをweeklyReportsテーブルに保存
 */
export async function saveWeeklyReport({
  db,
  weekStartDate,
  aiAgent = 'claude-code',
  overallSummary,
}: {
  db: D1Database;
  weekStartDate: string;
  aiAgent?: AIAgentType;
  overallSummary: string;
}): Promise<void> {
  try {
    const drizzleDB = drizzle(db);

    await drizzleDB
      .insert(weeklyReports)
      .values({
        weekStartDate,
        aiAgent,
        overallSummary,
        status: 'completed',
      })
      .onConflictDoUpdate({
        target: [weeklyReports.weekStartDate, weeklyReports.aiAgent],
        set: {
          overallSummary,
          status: 'completed',
        },
      });
  } catch (error) {
    logger.error(
      { weekStartDate, aiAgent, error },
      '週次レポートの保存に失敗しました',
    );
    throw new Error(`週次レポートの保存に失敗しました: ${error}`);
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
    logger.error(
      { weekStartDate, error },
      '週次レポートデータの存在確認に失敗しました',
    );
    return false; // エラー時は安全側でfalseを返す
  }
}

export async function fetchWeeklyDisplayData({
  db,
  site,
  weekStartDate,
  aiAgent,
}: {
  db: D1Database;
  site: SiteValueType;
  weekStartDate: string;
  aiAgent?: AIAgentType;
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
          // AIエージェントフィルターを追加
          aiAgent ? eq(articles.aiAgent, aiAgent) : undefined,
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
    logger.error(
      { site, weekStartDate, aiAgent, error },
      '週次表示データの取得に失敗しました',
    );
    throw new Error(`${site}の週次表示データ取得に失敗しました: ${error}`);
  }
}

/**
 * 最新の完成された週の開始日を取得
 * weeklyReportsテーブルからstatusが'completed'の最新weekStartDateを取得
 * @param db - D1データベースインスタンス
 * @returns 最新完成週の開始日 (YYYY-MM-DD形式) またはnull
 */
export async function getLatestCompletedWeek(
  db: D1Database,
): Promise<string | null> {
  try {
    const drizzleDB = drizzle(db);

    const result = await drizzleDB
      .select({ weekStartDate: weeklyReports.weekStartDate })
      .from(weeklyReports)
      .where(eq(weeklyReports.status, 'completed'))
      .orderBy(desc(weeklyReports.weekStartDate))
      .limit(1);

    return result[0]?.weekStartDate || null;
  } catch (error) {
    logger.error({ error }, '最新完了週の取得に失敗しました');
    return null; // エラー時は安全側でnullを返す
  }
}

/**
 * 週間レポートのデータを取得（サイト別に整理済み）
 * weeklySummariesテーブルとarticlesテーブルのINNER JOINで画面表示用データを取得
 */
export async function fetchWeeklyReportData({
  weekRange,
  db,
  aiAgent,
}: {
  weekRange: WeekRange;
  db: D1Database;
  aiAgent?: AIAgentType;
}): Promise<SiteRanking[]> {
  try {
    return await Promise.all(
      SITE_VALUES.map(async (site) => {
        const articles = await fetchWeeklyDisplayData({
          db,
          site,
          weekStartDate: weekRange.startDate,
          aiAgent,
        });
        return {
          site,
          articles: articles.map((article, index) => ({
            id: article.id,
            title: article.title,
            url: article.url,
            author: article.author,
            publishedAt: article.publishedAt,
            site: article.site,
            summary: article.summary, // AI要約を追加
            engagement: {
              likes: article.likesSnapshot, // Snapshot値を使用
              bookmarks: article.bookmarksSnapshot, // Snapshot値を使用
            },
            weeklyRank: index + 1,
          })),
        };
      }),
    );
  } catch (error) {
    logger.error(
      { weekRange, aiAgent, error },
      '週次レポートデータの取得に失敗しました',
    );
    return [];
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
  aiAgent,
}: {
  db: D1Database;
  weekStartDate: string;
  aiAgent?: AIAgentType;
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
          // AIエージェントフィルターを追加
          aiAgent ? eq(weeklyReports.aiAgent, aiAgent) : undefined,
        ),
      )
      .limit(1);

    return result[0]?.overallSummary || null;
  } catch (error) {
    logger.error(
      { weekStartDate, aiAgent, error },
      '全体要約の取得に失敗しました',
    );
    return null;
  }
}
