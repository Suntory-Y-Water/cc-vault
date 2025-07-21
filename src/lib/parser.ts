import { ZennArticle, ZennTopics, ZennResponse } from '@/types';
import * as cheerio from 'cheerio';

/**
 * Next.jsのNEXT_DATAを解析する
 * @param htmlString - HTML文字列
 * @returns 解析されたNEXT_DATAオブジェクト
 */
function parseNextData<T extends ZennArticle | ZennTopics>({
  htmlString,
}: { htmlString: string }) {
  const nextDataMatch = htmlString.match(
    /<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/,
  );
  if (!nextDataMatch || !nextDataMatch[1]) {
    throw new Error('NEXT_DATAタグが見つかりません');
  }

  const nextDataText = nextDataMatch[1].trim();
  try {
    return JSON.parse(nextDataText) as T;
  } catch (error) {
    throw new Error(`NEXT_DATAの解析に失敗しました: ${error}`);
  }
}

/**
 * Zennのトピックスページから記事データを取得する
 * @param htmlString - HTML文字列
 * @returns Zennの記事データ
 */
export function getZennTopicsData({
  htmlString,
}: { htmlString: string }): ZennResponse {
  try {
    // ZennTopics型としてNEXT_DATAを解析
    const nextData = parseNextData<ZennTopics>({ htmlString });

    // 記事データを抽出して変換
    const articles = nextData.props.pageProps.articles.map((article) => ({
      id: article.id,
      path: article.path,
      title: article.title,
      author: article.user.name,
      published_at: article.publishedAt,
      likedCount: article.likedCount,
      bookmarkedCount: article.bookmarkedCount,
    }));

    return {
      articles,
    };
  } catch (error) {
    throw new Error(`Zennのトピックスページデータ取得に失敗しました: ${error}`);
  }
}

/**
 * はてなブックマーク検索結果ページから記事データを取得する
 * @param htmlString - HTML文字列
 * @returns はてなブックマークの記事データ
 */
export function getHatenaBookmarkData({ htmlString }: { htmlString: string }) {
  try {
    const $ = cheerio.load(htmlString);
    const articles: {
      id: string;
      title: string;
      url: string;
      author: string;
      publishedAt: string;
      bookmarkCount: number;
    }[] = [];

    // li.bookmark-item要素を取得
    $('li.bookmark-item').each((_, element) => {
      const $element = $(element);

      // タイトルとURLを取得
      const titleLink = $element.find('.centerarticle-entry-title a');
      const title = titleLink.text().trim();
      const url = titleLink.attr('href');

      // 著者情報（サイト情報）を取得
      const siteLink = $element.find(
        '.centerarticle-entry-data a[title*="新着エントリー"]',
      );
      const author = siteLink.text().trim();

      // ブックマーク数を取得
      const usersLink = $element.find('.centerarticle-users a');
      const usersText = usersLink.text().trim();
      const bookmarkCount = Number.parseInt(usersText.replace(/\D/g, '')) || 0;

      // 公開日を取得
      const dateElement = $element.find('.entry-contents-date');
      const publishedAt = dateElement.text().trim();

      if (title && url) {
        articles.push({
          id: `hatena-${url}`,
          title,
          url,
          author,
          publishedAt,
          bookmarkCount,
        });
      }
    });

    return articles;
  } catch (error) {
    throw new Error(`はてなブックマークデータ取得に失敗しました: ${error}`);
  }
}
