import { fetchArticlesByTitle } from '@/lib/cloudflare';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { SITE_NAMES, SORT_ORDERS } from '@/types';
import type { SiteType, SortOrder } from '@/types';
import ArticleList from '@/components/article/ArticleList';
import SiteFilter from '@/components/layout/SiteFilter';
import MainTabs from '@/components/layout/MainTabs';
import Pagination from '@/components/article/Pagination';
import { getAIAgentFromHeaders } from '@/config/ai-agents';

type Props = {
  searchParams: Promise<{
    q?: string | string[];
    page?: string | string[];
    site?: string | string[];
    order?: string | string[];
  }>;
};

/**
 * 検索結果ページコンポーネント（テナント対応）
 *
 * 事前条件:
 * - searchParamsが有効なURLパラメータを含むこと
 * - Cloudflare環境で実行されること
 * - requestHeadersからホスト名が取得可能であること
 *
 * 事後条件:
 * - 検索条件に基づいた記事一覧が表示されること
 * - 現在のテナント（AIエージェント）スコープ内での検索結果が表示されること
 * - 適切なフィルタ・ソート・ページネーションが表示されること
 */
export default async function SearchPage({ searchParams }: Props) {
  const { env } = await getCloudflareContext({ async: true });

  // AIエージェント情報の取得（テナント識別）
  const aiAgent = await getAIAgentFromHeaders();

  // URLパラメータの取得と正規化
  const {
    q: queryParam,
    page: pageParam = '1',
    site: siteParam,
    order: orderParam,
  } = await searchParams;

  // 配列の場合は最初の値を使用
  const queryValue = Array.isArray(queryParam) ? queryParam[0] : queryParam;
  const pageValue = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const siteValue = Array.isArray(siteParam) ? siteParam[0] : siteParam;
  const orderValue = Array.isArray(orderParam) ? orderParam[0] : orderParam;

  const query = queryValue?.trim();
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

  // 検索クエリが存在しない場合のハンドリング
  if (!query || query === '') {
    return (
      <div className='max-w-[80rem] mx-auto px-4 py-8'>
        <div className='pt-6 pb-8'>
          <h1 className='text-3xl font-bold text-[#141413] mb-4'>検索結果</h1>
          <p className='text-lg text-[#7D4A38]'>
            検索キーワードを入力してください。
          </p>
        </div>
      </div>
    );
  }

  // D1データベースから検索結果を取得（テナント別フィルタリング適用）
  const paginatedData = await fetchArticlesByTitle({
    db: env.DB,
    searchParams: {
      query,
      page,
      limit,
      site,
      order,
      aiAgent: aiAgent.id,
    },
  });

  return (
    <div className='max-w-[80rem] mx-auto px-4 py-8'>
      <div className='pt-6 pb-8'>
        <h1 className='text-3xl font-bold text-[#141413] mb-4'>検索結果</h1>
        <p className='text-lg text-[#7D4A38] mb-4'>
          「{query}」の検索結果: {paginatedData.totalCount}件
        </p>
      </div>

      {paginatedData.totalCount > 0 ? (
        <>
          {/* サイトフィルター */}
          <div className='flex flex-wrap gap-2 mb-8'>
            <SiteFilter
              activeSite={site}
              currentSearchParams={{ site, order, q: query }}
            />
          </div>

          {/* ソートタブ */}
          <div className='mb-8'>
            <MainTabs
              order={order}
              currentSearchParams={{ site, order, q: query }}
            />
          </div>

          {/* 記事一覧 */}
          <ArticleList articles={paginatedData.articles} />

          {/* ページネーション */}
          {paginatedData.totalPages > 1 && (
            <div className='mt-12'>
              <Pagination
                currentPage={paginatedData.currentPage}
                totalPages={paginatedData.totalPages}
                hasNext={paginatedData.hasNext}
                hasPrevious={paginatedData.hasPrevious}
                searchParams={{ site, order, q: query }}
              />
            </div>
          )}
        </>
      ) : (
        <div className='text-center py-12'>
          <p className='text-xl text-[#7D4A38]'>
            「{query}」の検索結果が見つかりませんでした
          </p>
          <p className='text-base text-[#7D4A38] mt-2'>
            別のキーワードで検索してみてください。
          </p>
        </div>
      )}
    </div>
  );
}
