import { ZennResponse } from '@/types/article.js';
// @ts-ignore `.open-next/worker.ts` is generated at build time
import { default as handler } from './.open-next/worker.js';
import { convertToJstString } from '@/lib/utils.js';
import { fetchHtmlDocument } from '@/lib/fetchers.js';
import { getZennTopicsData } from '@/lib/parser.js';

/**
 * ZennデータをD1データベースに保存する
 * @param params - 保存パラメータ
 * @param params.db - D1データベースインスタンス
 * @param params.articles - 保存する記事データ配列
 */
async function saveZennArticlesToDB(params: {
  db: D1Database;
  articles: ZennResponse['articles'];
}): Promise<void> {
  const { db, articles } = params;
  for (const article of articles) {
    try {
      // 重複チェック＆挿入
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO articles (
          id, title, url, author, published_at, site, likes, bookmarks, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `);

      await stmt
        .bind(
          `zenn-${article.id}`,
          article.title,
          `https://zenn.dev${article.path}`,
          article.author,
          convertToJstString(article.published_at),
          'zenn',
          article.likedCount,
          article.bookmarkedCount,
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
   * 定期的にZennデータを取得してD1データベースに保存する
   */
  async scheduled(
    _controller: ScheduledController,
    env: CloudflareEnv,
    _ctx: ExecutionContext,
  ) {
    try {
      console.log('スケジュールタスクが実行されました');
      // Zennトピックスページから記事を取得（page.tsxと同じ実装）
      const zennTopicsUrl = `https://zenn.dev/topics/claudecode?order=latest`;

      // ローカル環境で動かすとき
      // Next.jsのキャッシュは使用できないためno-storeを使用
      const htmlString = await fetchHtmlDocument(zennTopicsUrl, {
        cache: 'no-store',
      });

      // ZennのHTMLパースロジック（実際の実装）
      const zennData = getZennTopicsData({ htmlString });

      // D1データベースに保存
      if (zennData.articles.length > 0) {
        await saveZennArticlesToDB({ db: env.DB, articles: zennData.articles });
        console.log('記事をデータベースに保存しました');
      } else {
        console.log('保存する記事がありませんでした');
      }
    } catch (error) {
      console.error('スケジュールタスクが失敗しました:', error);

      // エラーを再スローして失敗を明確にする
      throw error;
    }
  },
} satisfies ExportedHandler<CloudflareEnv>;
