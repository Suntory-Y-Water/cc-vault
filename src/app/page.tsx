import { headers } from 'next/headers';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getArticlesWithPagination } from '@/lib/cloudflare';
import { SiteType, SortOrder, SITE_NAMES, SORT_ORDERS } from '@/types';
import { resolveAIAgentFromHost } from '@/config/ai-agents';
import SiteFilter from '@/components/layout/SiteFilter';
import MainTabs from '@/components/layout/MainTabs';
import ArticleList from '@/components/article/ArticleList';
import Pagination from '@/components/article/Pagination';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';
import { buildThemeStyle } from '@/lib/utils';
import { getLogger } from '@/lib/logger';

/** 1時間で再検証 */
export const revalidate = 3600;
export const fetchCache = 'default-cache';

const logger = getLogger('app/page.tsx');

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * ホームページコンポーネント
 */
export default async function HomePage({ searchParams }: Props) {
  const { env } = await getCloudflareContext({ async: true });

  // AIエージェント識別
  const requestHeaders = await headers();
  const host = requestHeaders?.get('host') ?? null;
  const aiAgent = resolveAIAgentFromHost({ host });
  const themeStyles = buildThemeStyle(aiAgent.colors);

  // 公式推奨: 分割代入とデフォルト値を使用
  const {
    page: pageParam = '1',
    site: siteParam,
    order: orderParam,
  } = await searchParams;

  // 配列の場合は最初の値を使用
  const pageValue = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const siteValue = Array.isArray(siteParam) ? siteParam[0] : siteParam;
  const orderValue = Array.isArray(orderParam) ? orderParam[0] : orderParam;

  const page = Number(pageValue) || 1;

  // 型安全なバリデーション
  const site =
    siteValue && Object.keys(SITE_NAMES).includes(siteValue)
      ? (siteValue as SiteType)
      : 'all';
  const order =
    orderValue && Object.keys(SORT_ORDERS).includes(orderValue)
      ? (orderValue as SortOrder)
      : 'latest';
  const limit = 24; // 1ページあたりの記事数

  // D1データベースからページネーション対応でデータを取得
  const paginatedData = await getArticlesWithPagination(env.DB, {
    page,
    limit,
    site,
    order,
    aiAgent: aiAgent.id === 'default' ? 'all' : aiAgent.id,
  });

  logger.info(
    { agents: aiAgent.id, length: paginatedData.articles.length },
    '記事を取得しました',
  );

  return (
    <div className='max-w-[80rem] mx-auto px-4 py-8' style={themeStyles}>
      <div className='pt-6 pb-8'>
        <div className='flex flex-col gap-4'>
          <div>
            <h1 className='text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--ai-text)]'>
              {aiAgent.branding.siteName}
            </h1>
            <p className='mt-5 text-lg text-[var(--ai-secondary)]'>
              {aiAgent.name}中心の技術トレンドをまとめてチェック
            </p>
          </div>
          <div className='flex-shrink-0'>
            <Link href='/weekly-report'>
              <Button
                size='lg'
                className='bg-[var(--ai-primary)] hover:bg-[var(--ai-primary-hover)] text-white border-none text-base px-6 py-3'
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
