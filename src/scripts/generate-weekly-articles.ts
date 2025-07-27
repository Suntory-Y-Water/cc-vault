/**
 * 週次記事収集スクリプト
 * D1から記事を取得し、Zenn記事の本文を解析して週次処理用JSONを生成する
 */

import { getWeeklyArticlesFromD1 } from '@/lib/cloudflare';
import { parseNextData, extractArticleContent } from '@/lib/parser';
import { fetchHtmlDocument } from '@/lib/fetchers';
import { calculateWeekNumber } from '@/lib/weekly-report';
import type {
  ZennArticle,
  WeeklyProcessingArticle,
  WeeklyProcessingInput,
  ArticleD1Response,
} from '@/types';

import 'dotenv/config';

/**
 * Zenn記事から本文コンテンツを取得する
 * @param url - Zenn記事のURL
 * @returns 記事の本文テキスト
 */
async function fetchZennArticleContent(url: string): Promise<string> {
  try {
    const htmlString = await fetchHtmlDocument(url, { cache: 'no-store' });
    const zennData = parseNextData<ZennArticle>({ htmlString });

    const content = extractArticleContent({
      htmlString: zennData.props.pageProps.article.bodyHtml,
    });

    return content;
  } catch (error) {
    console.error(`記事の本文取得に失敗しました: ${url}`, error);
    return '本文の取得に失敗しました';
  }
}

/**
 * 週次記事データを生成して週次処理用JSONを出力する
 * @param db - D1データベースインスタンス
 * @param startDate - 開始日（YYYY-MM-DD形式）
 * @param endDate - 終了日（YYYY-MM-DD形式）
 * @returns 週次処理用JSON
 */
export async function generateWeeklyArticlesJson(
  db: D1Database,
  startDate: string,
  endDate: string,
): Promise<WeeklyProcessingInput> {
  // D1から指定期間の記事を取得
  const articles = await getWeeklyArticlesFromD1(db, startDate, endDate);

  // Zennサイトの記事のみフィルタリング
  const zennArticles = articles.filter((article) => article.site === 'zenn');

  // 各記事の本文を取得
  const weeklyProcessingArticles: WeeklyProcessingArticle[] = [];

  for (let i = 0; i < zennArticles.length; i++) {
    const article = zennArticles[i];
    const content = await fetchZennArticleContent(article.url);

    weeklyProcessingArticles.push({
      id: article.id,
      title: article.title,
      url: article.url,
      author: article.author,
      publishedAt: article.publishedAt,
      content,
      likes: article.engagement.likes,
      bookmarks: article.engagement.bookmarks,
      ranking: i + 1,
    });
  }

  // 週番号を計算
  const weekNumber = calculateWeekNumber(startDate);

  return {
    weekRange: {
      startDate,
      endDate,
      weekNumber,
    },
    articles: weeklyProcessingArticles,
  };
}

/**
 * Cloudflare D1 REST APIを使用して記事データを取得する
 * @param startDate - 開始日（YYYY-MM-DD形式）
 * @param endDate - 終了日（YYYY-MM-DD形式）
 * @returns 記事データの配列
 */
async function fetchArticlesFromD1RestApi(startDate: string, endDate: string) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
  const token = process.env.CLOUDFLARE_D1_TOKEN;

  if (!accountId || !databaseId || !token) {
    throw new Error(
      '必要な環境変数が設定されていません: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID, CLOUDFLARE_D1_TOKEN',
    );
  }

  const sql = `
    SELECT id, title, url, author, published_at, likes, bookmarks, site
    FROM articles 
    WHERE published_at >= ? AND published_at <= ?
    ORDER BY (likes + bookmarks) DESC
  `;

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sql,
        params: [startDate, endDate],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `D1 API request failed: ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as ArticleD1Response;

  if (!data.success) {
    throw new Error(`D1 API error: ${JSON.stringify(data.errors)}`);
  }

  return data.result[0].results.map((row) => ({
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
}

/**
 * メイン実行関数
 * コマンドライン引数から日付を取得して週次記事データを生成
 */
export async function main() {
  try {
    const args = process.argv.slice(2);

    if (args.length < 2) {
      throw new Error(
        '使用方法: npx tsx generate-weekly-articles.ts <startDate> <endDate>',
      );
    }

    const [startDate, endDate] = args;

    // 日付形式の簡単な検証
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(endDate)
    ) {
      throw new Error('日付はYYYY-MM-DD形式で指定してください');
    }

    console.log(`週次記事データを生成中: ${startDate} - ${endDate}`);

    // REST API経由でD1からデータを取得
    const articles = await fetchArticlesFromD1RestApi(startDate, endDate);

    // TODO: Zennサイトの記事のみフィルタリング
    const zennArticles = articles.filter((article) => article.site === 'zenn');

    // 各記事の本文を取得
    const weeklyProcessingArticles: WeeklyProcessingArticle[] = [];

    for (let i = 0; i < zennArticles.length; i++) {
      const article = zennArticles[i];
      const content = await fetchZennArticleContent(article.url);

      weeklyProcessingArticles.push({
        id: article.id,
        title: article.title,
        url: article.url,
        author: article.author,
        publishedAt: article.publishedAt,
        content,
        likes: article.engagement.likes,
        bookmarks: article.engagement.bookmarks,
        ranking: i + 1,
      });
    }

    // 週番号を計算
    const weekNumber = calculateWeekNumber(startDate);

    const result: WeeklyProcessingInput = {
      weekRange: {
        startDate,
        endDate,
        weekNumber,
      },
      articles: weeklyProcessingArticles.slice(0, 3), // 上位3件を取得
    };
    console.log('週次記事データの生成に成功しました');

    return result;
  } catch (error) {
    console.error('週次記事データ生成に失敗しました:', error);
    throw error;
  }
}
// スクリプトが直接実行された場合にmain関数を呼び出す
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
