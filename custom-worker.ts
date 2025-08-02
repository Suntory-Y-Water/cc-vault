import { ArticleRow, QiitaPost } from '@/types/article.js';
// @ts-ignore `.open-next/worker.ts` is generated at build time
import { default as handler } from './.open-next/worker.js';
import { convertToJstString, isZennOrQiitaUrl } from '@/lib/utils.js';
import { fetchHtmlDocument, fetchExternalData } from '@/lib/fetchers.js';
import { getZennTopicsData, getHatenaBookmarkData } from '@/lib/parser.js';

/**
 * 記事データをarticlesテーブルに保存する
 */
async function saveArticlesToDB(params: {
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
    }
  }
}

/**
 * カスタムWorker設定
 * OpenNext.jsのfetch handlerにscheduled handlerを追加
 */
export default {
  fetch: handler.fetch,

  /**
   * スケジュール処理ハンドラー
   * 定期的に全てのデータを取得してD1データベースに保存する
   */
  async scheduled(
    _controller: ScheduledController,
    env: CloudflareEnv,
    _ctx: ExecutionContext,
  ) {
    try {
      console.log('スケジュールタスクが実行されました');

      const allArticles: ArticleRow[] = [];

      // Zennデータ取得
      const zennTopicsUrl = `https://zenn.dev/topics/claudecode?order=latest`;
      const zennHtml = await fetchHtmlDocument(zennTopicsUrl, {
        cache: 'no-store',
      });
      const zennData = getZennTopicsData({ htmlString: zennHtml });

      zennData.articles.forEach((article) => {
        allArticles.push({
          id: `zenn-${article.id}`,
          title: article.title,
          url: `https://zenn.dev${article.path}`,
          author: article.author,
          published_at: convertToJstString(article.published_at),
          site: 'zenn',
          likes: article.likedCount,
          bookmarks: article.bookmarkedCount,
        });
      });

      // Qiitaデータ取得
      const qiitaUrl =
        'https://qiita.com/api/v2/items?query=claudecode&per_page=20&page=1';
      const qiitaData = await fetchExternalData<QiitaPost[]>(qiitaUrl, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.QIITA_ACCESS_TOKEN}`,
        },
      });

      qiitaData.forEach((article) => {
        allArticles.push({
          id: `qiita-${article.id}`,
          title: article.title,
          url: article.url,
          author: article.user.id,
          published_at: convertToJstString(article.created_at),
          site: 'qiita',
          likes: article.likes_count,
          bookmarks: article.stocks_count,
        });
      });

      // はてなブックマーク新着順
      const hatenaRecentUrl = `https://b.hatena.ne.jp/q/claudecode?target=tag&date_range=m&safe=on&users=3&sort=recent`;
      const hatenaRecentHtml = await fetchHtmlDocument(hatenaRecentUrl, {
        cache: 'no-store',
      });
      const hatenaRecentData = getHatenaBookmarkData({
        htmlString: hatenaRecentHtml,
      });

      hatenaRecentData.forEach((article) => {
        // ZennやQiitaのURLは除外（既に個別に取得済みのため）
        if (isZennOrQiitaUrl(article.url)) {
          return;
        }

        allArticles.push({
          id: article.id,
          title: article.title,
          url: article.url,
          author: article.author,
          published_at: convertToJstString(article.publishedAt),
          site: 'hatena',
          likes: 0, // はてなブックマークはlikesがないので0固定
          bookmarks: article.bookmarkCount,
        });
      });

      // はてなブックマーク人気順
      const hatenaPopularUrl = `https://b.hatena.ne.jp/q/claudecode?users=3&target=tag&sort=popular&date_range=m&safe=on`;
      const hatenaPopularHtml = await fetchHtmlDocument(hatenaPopularUrl, {
        cache: 'no-store',
      });
      const hatenaPopularData = getHatenaBookmarkData({
        htmlString: hatenaPopularHtml,
      });

      hatenaPopularData.forEach((article) => {
        // ZennやQiitaのURLは除外（既に個別に取得済みのため）
        if (isZennOrQiitaUrl(article.url)) {
          return;
        }

        allArticles.push({
          id: `${article.id}-popular`,
          title: article.title,
          url: article.url,
          author: article.author,
          published_at: convertToJstString(article.publishedAt),
          site: 'hatena',
          likes: 0,
          bookmarks: article.bookmarkCount,
        });
      });

      // D1データベースに保存
      if (allArticles.length > 0) {
        await saveArticlesToDB({ db: env.DB, articles: allArticles });
        console.log(
          `${allArticles.length}件の記事をデータベースに保存しました`,
        );
      }
      console.log('スケジュールタスクが完了しました');
    } catch (error) {
      console.error('スケジュールタスクが失敗しました:', error);
      throw error;
    }
  },
} satisfies ExportedHandler<CloudflareEnv>;
