import { Article, ArticleRow } from '@/types';

/**
 * D1データベースから記事を取得する
 * @param db - D1データベースインスタンス
 * @returns 記事の配列
 */
export async function getArticlesFromD1(db: D1Database): Promise<Article[]> {
  try {
    const stmt = db.prepare(`
      SELECT id, title, url, author, published_at, likes, bookmarks, created_at, updated_at, site
      FROM articles 
      ORDER BY published_at DESC
      LIMIT 100
    `);

    const result = await stmt.all<ArticleRow>();

    if (!result.results) {
      return [];
    }

    return result.results.map((row) => ({
      id: row.id,
      title: row.title,
      url: row.url,
      author: row.author,
      publishedAt: row.published_at,
      site: row.site as 'zenn' | 'qiita' | 'hatena',
      engagement: {
        likes: row.likes || 0,
        bookmarks: row.bookmarks || 0,
      },
    }));
  } catch (error) {
    console.error('D1から記事の取得に失敗しました:', error);
    throw new Error(`D1から記事の取得に失敗しました: ${error}`);
  }
}
