import { fetchHtmlDocument, fetchExternalData } from '@/lib/fetchers';
import { getHatenaBookmarkData } from '@/lib/parser';
import { Article, QiitaPost } from '@/types';
import { convertToJstString } from '@/lib/utils';
import ArticleContainer from '@/components/article/ArticleContainer';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { HATENA_CLAUDE_CODE_VARIANTS, EXCLUDE_DOMAINS } from '@/lib/constants';
import { getArticlesFromD1 } from '@/lib/cloudflare';

/**
 * ホームページコンポーネント
 * データ取得をサーバーサイドで実行し、結果をClient Componentに渡す
 */
export default async function HomePage() {
  const { env } = await getCloudflareContext({ async: true });
  // 並列処理で全データを取得
  const [dbArticles, qiitaData, hatenaRecentData, hatenaPopularData] =
    await Promise.all([
      // D1データベースから記事を取得
      getArticlesFromD1(env.DB),

      // QiitaのAPIから記事を取得
      (async () => {
        const qiitaData = await fetchExternalData<QiitaPost[]>(
          `https://qiita.com/api/v2/items?query=${encodeURIComponent('tag:claudecode')}`,
          {
            revalidate: 3600,
            tags: ['qiita-articles'],
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${env.QIITA_ACCESS_TOKEN}`,
            },
          },
        );

        return qiitaData;
      })(),

      // はてなブックマーク新着順から記事を取得（全キーワード）
      (async () => {
        const hatenaRecentPromises = HATENA_CLAUDE_CODE_VARIANTS.map(
          async (keyword) => {
            const hatenaRecentUrl = `https://b.hatena.ne.jp/q/${encodeURIComponent(keyword)}?target=tag&date_range=m&safe=on&users=3&sort=recent`;

            const htmlString = await fetchHtmlDocument(hatenaRecentUrl, {
              revalidate: 3600,
              tags: [`hatena-recent-${keyword}`],
            });

            return getHatenaBookmarkData({ htmlString });
          },
        );

        const results = await Promise.all(hatenaRecentPromises);
        return results.flat();
      })(),

      // はてなブックマーク人気順から記事を取得（全キーワード）
      (async () => {
        const hatenaPopularPromises = HATENA_CLAUDE_CODE_VARIANTS.map(
          async (keyword) => {
            const hatenaPopularUrl = `https://b.hatena.ne.jp/q/${encodeURIComponent(keyword)}?users=3&target=tag&sort=popular&date_range=m&safe=on`;

            const htmlString = await fetchHtmlDocument(hatenaPopularUrl, {
              revalidate: 3600,
              tags: [`hatena-popular-${keyword}`],
            });

            return getHatenaBookmarkData({ htmlString });
          },
        );

        const results = await Promise.all(hatenaPopularPromises);
        return results.flat();
      })(),
    ]);

  // 全記事を統合
  const allArticles: Article[] = [
    // D1から取得した記事
    ...dbArticles,
    // Qiitaの記事
    ...qiitaData.map((post) => ({
      id: `qiita-${post.id}`,
      title: post.title,
      url: post.url,
      author: post.user.name || post.user.id, // ユーザー名が空の場合はIDを使用
      publishedAt: convertToJstString(post.created_at),
      site: 'qiita' as const,
      engagement: {
        likes: post.likes_count,
        bookmarks: post.stocks_count,
      },
    })),
    // はてなブックマークの記事（新着順と人気順を統合、重複除去、Zenn/Qiita除外）
    ...Array.from(
      new Map(
        [...hatenaRecentData, ...hatenaPopularData]
          .filter(
            (post) =>
              !EXCLUDE_DOMAINS.some((domain) => post.url.startsWith(domain)),
          )
          .map((post) => [post.url, post]),
      ).values(),
    ).map((post) => ({
      id: post.id,
      title: post.title,
      url: post.url,
      author: post.author,
      publishedAt: post.publishedAt,
      site: 'hatena' as const,
      engagement: {
        likes: 0, // はてなにはいいねがないので0を設定
        bookmarks: post.bookmarkCount,
      },
    })),
  ];

  return (
    <div className='max-w-[80rem] mx-auto px-4 py-8'>
      <div className='pt-6 pb-8'>
        <h1 className='text-4xl md:text-6xl font-extrabold tracking-tight text-[#141413]'>
          CC-Vault
        </h1>
        <p className='mt-5 text-lg text-[#7D4A38]'>
          Claude Code中心の技術トレンドをまとめてチェック
        </p>
      </div>

      <ArticleContainer articles={allArticles} />
    </div>
  );
}
