import { fetchHtmlDocument } from '@/lib/fetchers';
import { getZennTopicsData } from '@/lib/parser';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import MainTabs from '@/components/layout/MainTabs';
import SiteFilter from '@/components/layout/SiteFilter';
import ArticleList from '@/components/article/ArticleList';
import type { Metadata } from 'next';
import { siteConfig, pageMetadata, siteFilterMetadata } from './config/site';
import { Article } from '@/types';

type PageProps = {
  searchParams: Promise<{
    order?: 'latest' | 'trending';
    site?: 'all' | 'hatena' | 'qiita' | 'zenn' | 'note' | 'docs';
    page?: string;
  }>;
};

/**
 * ホームページのメタデータ生成
 */
export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { order = 'latest', site = 'all' } = await searchParams;

  const isLatest = order === 'latest';
  const siteFilter = siteFilterMetadata[site];

  const title = isLatest
    ? `${pageMetadata.latest.title} - ${siteFilter.title}`
    : `${pageMetadata.trending.title} - ${siteFilter.title}`;

  const description = isLatest
    ? `${pageMetadata.latest.description} - ${siteFilter.description}`
    : `${pageMetadata.trending.description} - ${siteFilter.description}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/?order=${order}&site=${site}`,
      type: 'website',
    },
    twitter: {
      title,
      description,
    },
    alternates: {
      canonical: `${siteConfig.url}/?order=${order}&site=${site}`,
    },
  };
}

export default async function HomePage({ searchParams }: PageProps) {
  const { order = 'latest', site = 'all' } = await searchParams;

  // Zennのトピックスページから記事を取得
  const zennOrderParam = order === 'latest' ? 'latest' : 'daily';
  const zennTopicsUrl = `https://zenn.dev/topics/claudecode?order=${zennOrderParam}`;

  const document = await fetchHtmlDocument(zennTopicsUrl, {
    revalidate: 3600,
    tags: ['zenn-topics'],
  });

  const zennData = getZennTopicsData({ document });

  const articles: Article[] = zennData.articles.map((post) => {
    return {
      id: post.id.toString(),
      title: post.title,
      url: `https://zenn.dev${post.path}`,
      author: 'claudecode',
      publishedAt: post.published_at,
      site: 'zenn' as const,
      engagement: {
        likes: post.likedCount,
        bookmarks: post.bookmarkedCount,
      },
    };
  });

  return (
    <main className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold text-[#141413] mb-8'>CC-Vault</h1>

      {/* ナビゲーション */}
      <div className='mb-8'>
        <div className='space-y-4'>
          {/* メインタブとウィークリーレポートボタン */}
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div className='flex-1'>
              <MainTabs order={order} />
            </div>
            <Link href='/weekly-report'>
              <Button
                variant='outline'
                className='border-[#DB8163] text-[#DB8163] hover:bg-[#DB8163] hover:text-[#FAF9F5] transition-colors font-medium'
              >
                ウィークリーレポート
              </Button>
            </Link>
          </div>

          {/* サイトフィルター */}
          <SiteFilter activeSite={site} />
        </div>
      </div>

      <div className='mb-6'>
        <p className='text-[#141413] opacity-70'>
          現在の表示: {site === 'all' ? '全サイト' : site} /{' '}
          {order === 'latest' ? '新着順' : 'トレンド順'}
        </p>
      </div>

      <ArticleList articles={articles} />
    </main>
  );
}
