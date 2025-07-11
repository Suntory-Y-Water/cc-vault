import { fetchExternalData } from '@/lib/fetchers';
import type { ZennResponse } from '@/types';

type PageProps = {
  searchParams: Promise<{
    order?: 'latest' | 'trending';
    site?: 'all' | 'hatena' | 'qiita' | 'zenn' | 'note' | 'docs';
    page?: string;
  }>;
};

export default async function HomePage({ searchParams }: PageProps) {
  const { order = 'latest', site = 'all', page = '1' } = await searchParams;

  // Zennの記事を取得
  const zennData = await fetchExternalData<ZennResponse>(
    `https://zenn.dev/api/articles?username=sui_water&order=${order}`,
    {
      revalidate: 60,
      tags: ['zenn-articles'],
    },
  );

  const articles = zennData.articles.map((post) => {
    return {
      id: post.id.toString(),
      title: post.title,
      url: `https://zenn.dev${post.path}`,
      author: 'sui_water',
      publishedAt: post.published_at,
      site: 'zenn' as const,
      engagement: {
        likes: 0,
        bookmarks: 0,
        comments: 0,
        shares: 0,
      },
      emoji: post.emoji,
    };
  });

  return (
    <main className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold text-gray-800 mb-8'>CC-Vault</h1>

      <div className='mb-6'>
        <p className='text-gray-600'>
          現在の表示: {site === 'all' ? '全サイト' : site} /{' '}
          {order === 'latest' ? '新着順' : 'トレンド順'}
        </p>
      </div>

      <div className='grid gap-4'>
        {articles.map((article) => (
          <div
            key={article.id}
            className='border rounded-lg p-4 hover:shadow-md transition-shadow'
          >
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-2'>
                  <span className='text-xl'>{article.emoji}</span>
                  <span className='text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded'>
                    Zenn
                  </span>
                </div>
                <h2 className='text-xl font-semibold text-gray-800 mb-2'>
                  {article.title}
                </h2>
                <div className='flex items-center gap-4 text-sm text-gray-600'>
                  <span>著者: {article.author}</span>
                  <span>
                    公開日:{' '}
                    {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              </div>
              <a
                href={article.url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 hover:text-blue-800 underline'
              >
                続きを読む
              </a>
            </div>
          </div>
        ))}
      </div>

      {articles.length === 0 && (
        <div className='text-center text-gray-600 py-8'>
          <p>記事が見つかりませんでした。</p>
        </div>
      )}
    </main>
  );
}
