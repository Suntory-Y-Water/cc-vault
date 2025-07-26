import { Article, ArticleRow } from '@/types';

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
