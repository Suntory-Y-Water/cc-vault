import { ArticlePaginationParams, PaginatedArticles } from '@/types';
import { drizzle } from 'drizzle-orm/d1';
import { eq, desc, count, sql } from 'drizzle-orm';
import { articles } from '@/config/drizzle/schema';

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
