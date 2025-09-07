import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getArticlesWithPagination } from '@/lib/cloudflare';
import { validateQueryParams } from '@/lib/utils';
import SiteFilter from '@/components/layout/SiteFilter';
import MainTabs from '@/components/layout/MainTabs';
import ArticleList from '@/components/article/ArticleList';
import Pagination from '@/components/article/Pagination';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';

/** 1時間で再検証 */
export const revalidate = 3600;
export const fetchCache = 'default-cache';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * ホームページコンポーネント
 */
export default async function HomePage({ searchParams }: Props) {
  const { env } = await getCloudflareContext({ async: true });

  // 型安全なクエリパラメータバリデーション
  const rawParams = await searchParams;
  const { page, site, order } = validateQueryParams({
    page: rawParams.page,
    site: rawParams.site,
    order: rawParams.order,
  });
  const limit = 24; // 1ページあたりの記事数

  // D1データベースからページネーション対応でデータを取得
  const paginatedData = await getArticlesWithPagination(env.DB, {
    page,
    limit,
    site,
    order,
  });

  return (
    <div className='max-w-[80rem] mx-auto px-4 py-8'>
      <div className='pt-6 pb-8'>
        <div className='flex flex-col gap-4'>
          <div>
            <h1 className='text-4xl md:text-6xl font-extrabold tracking-tight text-[#141413]'>
              CC-Vault
            </h1>
            <p className='mt-5 text-lg text-[#7D4A38]'>
              Claude Code中心の技術トレンドをまとめてチェック
            </p>
          </div>
          <div className='flex-shrink-0'>
            <Link href='/weekly-report'>
              <Button
                size='lg'
                className='bg-[#DB8163] hover:bg-[#C2754E] text-white border-none text-base px-6 py-3'
              >
                <BarChart3 className='w-5 h-5 mr-2' />
                週間レポートを見る
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* サイトフィルター */}
      <div className='flex flex-wrap gap-2 mb-8'>
        <SiteFilter activeSite={site} currentSearchParams={{ site, order }} />
      </div>

      {/* メインコンテンツ */}
      <div>
        <MainTabs order={order} currentSearchParams={{ site, order }} />

        <ArticleList articles={paginatedData.articles} />

        {/* ページネーション */}
        {paginatedData.totalPages > 1 && (
          <Pagination
            currentPage={paginatedData.currentPage}
            totalPages={paginatedData.totalPages}
            hasNext={paginatedData.hasNext}
            hasPrevious={paginatedData.hasPrevious}
            searchParams={{
              site: site !== 'all' ? site : undefined,
              order: order !== 'latest' ? order : undefined,
            }}
          />
        )}
      </div>
    </div>
  );
}
