import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SortOrder, SORT_ORDERS, SiteType } from '@/types/article';

type Props = {
  order: SortOrder;
  currentSearchParams: {
    site: SiteType;
    order: SortOrder;
    q?: string;
  };
};

/**
 * ソート用のクエリパラメータを作成する
 * @param targetOrder - 選択したソート順
 * @param currentSite - 現在のサイトフィルタ
 * @returns URLクエリパラメータ文字列
 */
function createSortUrl(
  targetOrder: SortOrder,
  currentSite: SiteType,
  currentQuery?: string,
): string {
  const params = new URLSearchParams();

  // 検索クエリがある場合は検索ページ、ない場合はホームページ
  const basePath = currentQuery ? '/search' : '/';

  if (currentQuery) {
    params.set('q', currentQuery);
  }

  if (currentSite !== 'all') {
    params.set('site', currentSite);
  }

  if (targetOrder !== 'latest') {
    params.set('order', targetOrder);
  }

  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

/**
 * メインタブコンポーネント
 * RSCでLinkベースのソート機能を提供
 */
export default function MainTabs({ order, currentSearchParams }: Props) {
  const currentTab = order === SORT_ORDERS.latest ? 'new' : 'trending';

  return (
    <Tabs value={currentTab}>
      <TabsList className='grid w-full grid-cols-2 bg-[#E0DFDA] rounded-lg p-1'>
        <TabsTrigger value='new' asChild>
          <Link
            href={createSortUrl(
              SORT_ORDERS.latest,
              currentSearchParams.site,
              currentSearchParams.q,
            )}
            prefetch={true}
            className='data-[state=active]:bg-[#FAF9F5] data-[state=active]:text-[#141413] text-[#141413] font-medium w-full cursor-pointer flex items-center justify-center'
          >
            新着
          </Link>
        </TabsTrigger>
        <TabsTrigger value='trending' asChild>
          <Link
            href={createSortUrl(
              SORT_ORDERS.trending,
              currentSearchParams.site,
              currentSearchParams.q,
            )}
            prefetch={true}
            className='data-[state=active]:bg-[#FAF9F5] data-[state=active]:text-[#141413] text-[#141413] font-medium w-full cursor-pointer flex items-center justify-center'
          >
            トレンド
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
