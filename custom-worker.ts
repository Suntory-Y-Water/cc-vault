import { AIAgentType, ArticleRow, QiitaPost } from '@/types/article.js';
// @ts-ignore `.open-next/worker.ts` is generated at build time
import { default as handler } from './.open-next/worker.js';
import { convertToJstString, isZennOrQiitaUrl } from '@/lib/utils.js';
import { fetchHtmlDocument, fetchExternalData } from '@/lib/fetchers.js';
import {
  getZennTopicsData,
  getHatenaBookmarkData,
  fetchArticleContent,
} from '@/lib/parser.js';
import {
  saveArticlesToDB,
  fetchTopArticles,
  saveWeeklySummaries,
  saveWeeklyReport,
} from '@/lib/cloudflare.js';
import {
  calculatePreviousWeek,
  getCurrentJSTDate,
} from '@/lib/weekly-report.js';
import { createGeminiClient, getGeminiResponse } from '@/lib/gemini.js';
import {
  getArticleSummaryPrompt,
  getOverallSummaryPrompt,
} from '@/lib/prompts.js';
import { SlackClient } from '@/lib/slack.js';

/**
 * カスタムWorker設定
 * OpenNext.jsのfetch handlerにscheduled handlerを追加
 */
import { getLogger } from '@/lib/logger';
import { TZDate } from '@date-fns/tz';
import { format } from 'date-fns';

const logger = getLogger('custom-worker');
const worker = {
  /**
   * HTTPリクエストハンドラー
   * 通常のリクエスト + 認証付き手動実行エンドポイントを処理
   */
  async fetch(
    request: Request,
    env: CloudflareEnv,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);
    // 認証付き手動実行エンドポイント
    if (url.pathname === '/manual-trigger') {
      // Bearer token認証
      const authHeader = request.headers.get('Authorization');
      if (
        !authHeader ||
        !authHeader.startsWith('Bearer ') ||
        authHeader.slice(7) !== env.MANUAL_TRIGGER_SECRET
      ) {
        return new Response('Unauthorized', { status: 401 });
      }

      const cronType = url.searchParams.get('cron');

      if (cronType === 'articles') {
        const controller: ScheduledController = {
          cron: '0 23,0-14 * * *',
          scheduledTime: Date.now(),
          noRetry: () => {},
        };

        await worker.scheduled(controller, env, ctx);
        return new Response('記事取得処理を実行しました', { status: 200 });
      }

      if (cronType === 'weekly') {
        const controller: ScheduledController = {
          cron: '0 15 * * SUN',
          scheduledTime: Date.now(),
          noRetry: () => {},
        };

        await worker.scheduled(controller, env, ctx);
        return new Response('週次レポート生成を実行しました', { status: 200 });
      }

      return new Response(
        'Usage: /manual-trigger?cron=articles または /manual-trigger?cron=weekly',
        { status: 400 },
      );
    }

    // 通常のNext.jsリクエストは元のhandlerに委譲
    return handler.fetch(request, env, ctx);
  },

  /**
   * スケジュール処理ハンドラー
   * 定期的に全てのデータを取得してD1データベースに保存する
   */
  async scheduled(
    controller: ScheduledController,
    env: CloudflareEnv,
    _ctx: ExecutionContext,
  ) {
    logger.info(
      { cron: controller.cron },
      'スケジュールタスクが実行されました',
    );

    const slackClient = new SlackClient(env.SLACK_BOT_TOKEN);

    switch (controller.cron) {
      /**
       * 定時記事更新処理
       */
      case '0 23,0-14 * * *': {
        const scheduledTime = new Date(controller.scheduledTime);
        const jstNow = new TZDate(scheduledTime, 'Asia/Tokyo');
        const formatDate = format(jstNow, "yyyy-MM-dd'T'HH:mm:ss");
        try {
          logger.info(
            { cron: controller.cron, scheduledTime: formatDate },
            '定時記事更新処理を開始します',
          );
          // すべての記事データを格納する配列
          const allArticles: ArticleRow[] = [];

          const targetSearchParams = [
            { agent: 'codex', searchWord: 'codex' },
            {
              agent: 'claude-code',
              searchWord: 'claudecode',
            },
          ] as const;
          for (const target of targetSearchParams) {
            logger.info(
              { agent: target.agent },
              `${target.agent}の記事取得を開始します`,
            );
            // Zennデータ取得
            const zennTopicsUrl = `https://zenn.dev/topics/${target.searchWord}?order=latest`;
            const zennHtml = await fetchHtmlDocument(zennTopicsUrl, {
              cache: 'no-store',
            });
            const zennData = getZennTopicsData({ htmlString: zennHtml });

            for (const article of zennData.articles) {
              allArticles.push({
                id: `zenn-${article.id}`,
                title: article.title,
                url: `https://zenn.dev${article.path}`,
                author: article.author,
                published_at: convertToJstString(article.published_at),
                site: 'zenn',
                ai_agent: target.agent,
                likes: article.likedCount,
                bookmarks: article.bookmarkedCount,
              });
            }

            // Qiitaデータ取得
            const qiitaUrl = `https://qiita.com/api/v2/items?query=${target.searchWord}&per_page=20&page=1`;
            const qiitaData = await fetchExternalData<QiitaPost[]>(qiitaUrl, {
              cache: 'no-store',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${env.QIITA_ACCESS_TOKEN}`,
              },
            });

            for (const article of qiitaData) {
              allArticles.push({
                id: `qiita-${article.id}`,
                title: article.title,
                url: article.url,
                author: article.user.id,
                published_at: convertToJstString(article.created_at),
                site: 'qiita',
                ai_agent: target.agent,
                likes: article.likes_count,
                bookmarks: article.stocks_count,
              });
            }

            // はてなブックマーク新着順
            const hatenaRecentUrl = `https://b.hatena.ne.jp/q/${target.searchWord}?target=tag&date_range=m&safe=on&users=3&sort=recent`;
            const hatenaRecentHtml = await fetchHtmlDocument(hatenaRecentUrl, {
              cache: 'no-store',
            });
            const hatenaRecentData = getHatenaBookmarkData({
              htmlString: hatenaRecentHtml,
            });

            for (const article of hatenaRecentData) {
              // ZennやQiitaのURLは個別に取得済みのため次のループへ
              if (isZennOrQiitaUrl(article.url)) {
                continue;
              }

              allArticles.push({
                id: article.id,
                title: article.title,
                url: article.url,
                author: article.author,
                published_at: convertToJstString(article.publishedAt),
                site: 'hatena',
                ai_agent: target.agent,
                likes: 0, // はてなブックマークはlikesがないので0固定
                bookmarks: article.bookmarkCount,
              });
            }

            // はてなブックマーク人気順
            const hatenaPopularUrl = `https://b.hatena.ne.jp/q/${target.agent}?users=3&target=tag&sort=popular&date_range=m&safe=on`;
            const hatenaPopularHtml = await fetchHtmlDocument(
              hatenaPopularUrl,
              {
                cache: 'no-store',
              },
            );
            const hatenaPopularData = getHatenaBookmarkData({
              htmlString: hatenaPopularHtml,
            });

            for (const article of hatenaPopularData) {
              // ZennやQiitaのURLは個別に取得済みのため次のループへ
              if (isZennOrQiitaUrl(article.url)) {
                continue;
              }
              allArticles.push({
                id: article.id,
                title: article.title,
                url: article.url,
                author: article.author,
                published_at: convertToJstString(article.publishedAt),
                site: 'hatena',
                ai_agent: target.agent,
                likes: 0,
                bookmarks: article.bookmarkCount,
              });
            }
            logger.info(
              { agent: target.agent, count: allArticles.length },
              `${target.agent}の記事取得が完了しました`,
            );
          }
          // 登録前にURLとai_agentの組み合わせでユニークにする
          const uniqueArticles = allArticles.filter(
            (article, index, self) =>
              self.findIndex(
                (a) => a.url === article.url && a.ai_agent === article.ai_agent,
              ) === index,
          );

          // D1データベースに保存
          if (uniqueArticles.length > 0) {
            await saveArticlesToDB({ db: env.DB, articles: uniqueArticles });
            logger.info(
              { count: uniqueArticles.length },
              `記事の保存が完了しました`,
            );
          }

          await slackClient.postMessage({
            channelId: env.SLACK_CHANNEL_ID,
            level: 'INFO',
            message: `記事取得処理完了 ${uniqueArticles.length}件`,
          });
        } catch (error) {
          logger.error(
            {
              error:
                error instanceof Error
                  ? {
                      message: error.message,
                      name: error.name,
                      stack: error.stack,
                    }
                  : error,
            },
            '定時記事更新処理中にエラーが発生しました',
          );

          const errorMessage =
            error instanceof Error ? error.message : String(error);
          await slackClient.postMessage({
            channelId: env.SLACK_CHANNEL_ID,
            level: 'ERROR',
            message: `記事取得処理エラー ${errorMessage}`,
            channelMention: true,
          });
        }
        break;
      }

      /**
       * 週次レポート生成処理
       * 毎週月曜日 JST 00:00 (UTC 15:00 日曜日) に実行
       */
      case '0 15 * * SUN': {
        try {
          logger.info(
            { cron: controller.cron },
            '週次レポート生成処理を開始します',
          );

          // 1. 実行日時をJSTで取得
          const executionDateJST = getCurrentJSTDate();

          // 2. 前週の範囲を計算
          const weekRange = calculatePreviousWeek(executionDateJST);
          logger.info(
            { startDate: weekRange.startDate, endDate: weekRange.endDate },
            '週次レポートの対象期間を決定しました',
          );

          // 3. AIエージェントごとにレポート生成
          const targetAgents = ['claude-code', 'codex'] as const;

          for (const aiAgent of targetAgents) {
            logger.info(
              { aiAgent },
              `${aiAgent}の週次レポート生成を開始します`,
            );

            // 3-1. 各サイトの上位3記事を取得
            const topArticles = await fetchTopArticles({
              db: env.DB,
              weekRange,
              aiAgent,
            });
            logger.info(
              { aiAgent, count: topArticles.length },
              '週次対象記事の取得が完了しました',
            );

            // 3-2. 各記事の本文取得と要約生成
            const summaries = await generateArticleSummaries({
              env,
              articles: topArticles,
              aiAgent,
            });
            logger.info(
              { aiAgent, count: summaries.length },
              '週次要約生成が完了しました',
            );

            // 3-3. DBに要約データ保存
            await saveWeeklySummaries({
              db: env.DB,
              summaries,
              weekStartDate: weekRange.startDate,
            });

            // 3-4. 全体総括文章生成
            const overallSummary = await generateOverallSummary({
              env,
              summaries,
              aiAgent,
            });

            // 3-5. 週次レポート保存
            await saveWeeklyReport({
              db: env.DB,
              weekStartDate: weekRange.startDate,
              aiAgent,
              overallSummary,
            });

            logger.info(
              { aiAgent, weekStartDate: weekRange.startDate },
              `${aiAgent}の週次レポート生成処理が完了しました`,
            );
          }

          logger.info(
            { weekStartDate: weekRange.startDate },
            '全AIエージェントの週次レポート生成処理が完了しました',
          );

          await slackClient.postMessage({
            channelId: env.SLACK_CHANNEL_ID,
            level: 'INFO',
            message: `週次レポート生成完了 ${weekRange.startDate}`,
          });
          break;
        } catch (error) {
          logger.error(
            {
              error:
                error instanceof Error
                  ? {
                      message: error.message,
                      name: error.name,
                      stack: error.stack,
                    }
                  : error,
            },
            '週次レポート生成処理中にエラーが発生しました',
          );

          const errorMessage =
            error instanceof Error ? error.message : String(error);
          await slackClient.postMessage({
            channelId: env.SLACK_CHANNEL_ID,
            level: 'ERROR',
            message: `週次レポート生成エラー ${errorMessage}`,
            channelMention: true,
          });
        }
      }
    }
    logger.info({ cron: controller.cron }, 'スケジュールタスクが完了しました');
  },
} satisfies ExportedHandler<CloudflareEnv>;

export default worker;

/**
 * 記事要約生成処理
 */
async function generateArticleSummaries({
  env,
  articles,
  aiAgent,
}: {
  env: CloudflareEnv;
  articles: ArticleRow[];
  aiAgent: AIAgentType;
}): Promise<
  {
    articleId: string;
    summary: string;
    likesSnapshot: number;
    bookmarksSnapshot: number;
  }[]
> {
  const geminiClient = createGeminiClient({ apiKey: env.GEMINI_API_KEY });
  const summaries: {
    articleId: string;
    summary: string;
    likesSnapshot: number;
    bookmarksSnapshot: number;
  }[] = [];

  for (const article of articles) {
    try {
      // 記事本文取得
      const content = await fetchArticleContent(article.url);

      // AI要約生成
      const prompt = getArticleSummaryPrompt({
        articleContent: content,
        aiAgent: aiAgent as 'claude-code' | 'codex',
      });
      const result = await getGeminiResponse({ ai: geminiClient, prompt });

      logger.info(
        {
          articleId: article.id,
          promptTokens: result.usageMetadata?.promptTokenCount ?? null,
          responseTokens: result.usageMetadata?.responseTokenCount ?? null,
          totalTokens: result.usageMetadata?.totalTokenCount ?? null,
        },
        '記事要約生成が完了しました',
      );

      summaries.push({
        articleId: article.id,
        summary: result.text,
        likesSnapshot: article.likes,
        bookmarksSnapshot: article.bookmarks,
      });
    } catch (error) {
      logger.error(
        {
          error:
            error instanceof Error
              ? {
                  message: error.message,
                  name: error.name,
                  stack: error.stack,
                }
              : error,
        },
        '記事要約生成に失敗しました',
      );
      // エラーが発生した記事はスキップして続行
    }
  }

  return summaries;
}

/**
 * 全体総括文章生成処理
 */
async function generateOverallSummary({
  env,
  summaries,
  aiAgent,
}: {
  env: CloudflareEnv;
  summaries: {
    articleId: string;
    summary: string;
    likesSnapshot: number;
    bookmarksSnapshot: number;
  }[];
  aiAgent: AIAgentType;
}): Promise<string> {
  const geminiClient = createGeminiClient({ apiKey: env.GEMINI_API_KEY });
  const prompt = getOverallSummaryPrompt({
    summaries,
    aiAgent: aiAgent as 'claude-code' | 'codex',
  });
  const result = await getGeminiResponse({ ai: geminiClient, prompt });

  logger.info(
    {
      promptTokens: result.usageMetadata?.promptTokenCount ?? null,
      responseTokens: result.usageMetadata?.responseTokenCount ?? null,
      totalTokens: result.usageMetadata?.totalTokenCount ?? null,
    },
    '全体総括生成が完了しました',
  );

  return result.text;
}
