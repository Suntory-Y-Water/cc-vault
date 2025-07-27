import {
  ArticleRow,
  ArticlePaginationParams,
  PaginatedArticles,
} from '@/types';

// SQLクエリテンプレート
const SQL_QUERIES = {
  COUNT: `
    SELECT COUNT(*) as total
    FROM articles
  `,
  SELECT_ARTICLES: `
    SELECT id, title, url, author, published_at, likes, bookmarks, site
    FROM articles
  `,
} as const;

// ORDER BY句の定義
const ORDER_CLAUSES = {
  trending: 'ORDER BY (likes + bookmarks) DESC, published_at DESC',
  latest: 'ORDER BY published_at DESC',
} as const;

/**
 * クエリ条件を構築
 */
function buildQueryConditions(
  site?: string,
  order: 'trending' | 'latest' = 'latest',
) {
  const whereClause = site && site !== 'all' ? 'WHERE site = ?' : '';
  const orderClause = ORDER_CLAUSES[order];
  const bindings = site && site !== 'all' ? [site] : [];

  return { whereClause, orderClause, bindings };
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
    const { whereClause, orderClause, bindings } = buildQueryConditions(
      site,
      order,
    );

    // 総件数を取得
    const countQuery = `${SQL_QUERIES.COUNT} ${whereClause}`.trim();
    const countStmt = db.prepare(countQuery);

    const countResult = await (bindings.length > 0
      ? countStmt.bind(...bindings).first<{ total: number }>()
      : countStmt.first<{ total: number }>());

    const totalCount = countResult?.total || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // 記事データを取得
    const dataQuery =
      `${SQL_QUERIES.SELECT_ARTICLES} ${whereClause} ${orderClause} LIMIT ? OFFSET ?`.trim();
    const dataStmt = db.prepare(dataQuery);
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
