import { ZennArticle, ZennTopics, ZennResponse } from '@/types';

/**
 * Next.jsのNEXT_DATAを解析する
 */
function parseNextData<T extends ZennArticle | ZennTopics>({
  document,
}: { document: Document }) {
  const nextDataText = document.querySelector('#__NEXT_DATA__')?.textContent;
  if (!nextDataText) {
    throw new Error('NEXT_DATAタグが見つかりません');
  }

  try {
    return JSON.parse(nextDataText) as T;
  } catch (error) {
    throw new Error(`NEXT_DATAの解析に失敗しました: ${error}`);
  }
}

/**
 * Zennのトピックスページから記事データを取得する
 * @param document - HTMLドキュメント
 * @returns Zennの記事データ
 */
export function getZennTopicsData({
  document,
}: { document: Document }): ZennResponse {
  try {
    // ZennTopics型としてNEXT_DATAを解析
    const nextData = parseNextData<ZennTopics>({ document });

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

// /**
//  * Zennの記事ページから記事データを取得する
//  * @param document - HTMLドキュメント
//  * @returns Zennの記事データ
//  */
// export function getZennArticleData({
//   document,
// }: { document: Document }): ZennResponse {
//   try {
//     // ZennArticle型としてNEXT_DATAを解析
//     const nextData = parseNextData<ZennArticle>({ document });

//     // 記事データを抽出して変換
//     const article = nextData.props.pageProps.article;
//     const articles = [
//       {
//         id: article.id,
//         path: article.path,
//         title: article.title,
//         author: article.,
//         published_at: article.publishedAt,
//         likedCount: article.likedCount,
//         bookmarkedCount: article.bookmarkedCount,
//       },
//     ];

//     return {
//       articles,
//     };
//   } catch (error) {
//     throw new Error(`Zennの記事ページデータ取得に失敗しました: ${error}`);
//   }
// }
