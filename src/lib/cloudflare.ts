import {
  Article,
  ArticleRow,
  ArticlePaginationParams,
  PaginatedArticles,
} from '@/types';

/**
 * D1データベースから記事を取得する
 * @param db - D1データベースインスタンス
 * @returns 記事の配列
 */
export async function getArticlesFromD1(db: D1Database): Promise<Article[]> {
  try {
    const stmt = db.prepare(`
      SELECT id, title, url, author, published_at, likes, bookmarks, site
      FROM articles 
      ORDER BY published_at DESC
    `);

    const { results } = await stmt.all<ArticleRow>();

    if (results.length === 0) {
      return [];
    }

    return results.map((row) => ({
      id: row.id,
      title: row.title,
      url: row.url,
      author: row.author,
      publishedAt: row.published_at,
      site: row.site,
      engagement: {
        likes: row.likes,
        bookmarks: row.bookmarks,
      },
    }));
  } catch (error) {
    console.error('D1から記事の取得に失敗しました:', error);
    throw new Error(`D1から記事の取得に失敗しました: ${error}`);
  }
}

/**
 * D1データベースから指定期間の記事を取得する
 * @param db - D1データベースインスタンス
 * @param startDate - 開始日（YYYY-MM-DD形式）
 * @param endDate - 終了日（YYYY-MM-DD形式）
 * @returns 記事の配列
 */
export async function getWeeklyArticlesFromD1(
  db: D1Database,
  startDate: string,
  endDate: string,
): Promise<Article[]> {
  try {
    const stmt = db.prepare(`
      SELECT id, title, url, author, published_at, likes, bookmarks, site
      FROM articles 
      WHERE published_at >= ? AND published_at <= ?
      ORDER BY (likes + bookmarks) DESC
    `);

    const { results } = await stmt.bind(startDate, endDate).all<ArticleRow>();

    if (results.length === 0) {
      return [];
    }

    return results.map((row) => ({
      id: row.id,
      title: row.title,
      url: row.url,
      author: row.author,
      publishedAt: row.published_at,
      site: row.site,
      engagement: {
        likes: row.likes,
        bookmarks: row.bookmarks,
      },
    }));
  } catch (error) {
    console.error('D1から週次記事の取得に失敗しました:', error);
    throw new Error(`D1から週次記事の取得に失敗しました: ${error}`);
  }
}

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
    const { page, limit, site, order } = params;
    const offset = (page - 1) * limit;

    // WHERE句の構築
    let whereClause = '';
    const bindings: unknown[] = [];

    if (site && site !== 'all') {
      whereClause = 'WHERE site = ?';
      bindings.push(site);
    }

    // ORDER BY句の構築
    let orderClause = '';
    if (order === 'trending') {
      orderClause = 'ORDER BY (likes + bookmarks) DESC, published_at DESC';
    } else {
      // 'latest' の場合：更新日時の降順（新しい順）
      orderClause = 'ORDER BY published_at DESC';
    }

    // 総件数を取得
    const countStmt = db.prepare(`
      SELECT COUNT(*) as total
      FROM articles 
      ${whereClause}
    `);

    const countResult = await (bindings.length > 0
      ? countStmt.bind(...bindings).first<{ total: number }>()
      : countStmt.first<{ total: number }>());

    const totalCount = countResult?.total || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // 記事データを取得
    const dataStmt = db.prepare(`
      SELECT id, title, url, author, published_at, likes, bookmarks, site
      FROM articles 
      ${whereClause}
      ${orderClause}
      LIMIT ? OFFSET ?
    `);

    const dataBindings = [...bindings, limit, offset];
    const { results } = await dataStmt.bind(...dataBindings).all<ArticleRow>();

    const articles = results.map((row) => ({
      id: row.id,
      title: row.title,
      url: row.url,
      author: row.author,
      publishedAt: row.published_at,
      site: row.site,
      engagement: {
        likes: row.likes,
        bookmarks: row.bookmarks,
      },
    }));

    return {
      articles,
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
