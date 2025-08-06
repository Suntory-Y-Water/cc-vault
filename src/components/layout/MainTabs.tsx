import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SortOrder, SORT_ORDERS, SiteType } from '@/types/article';

type Props = {
  order: SortOrder;
  currentSearchParams: {
    site: SiteType;
    order: SortOrder;
  };
};

/**
 * ソート用のクエリパラメータを作成する
 * @param targetOrder - 選択したソート順
 * @param currentSite - 現在のサイトフィルタ
 * @returns URLクエリパラメータ文字列
 */
function createSortUrl(targetOrder: SortOrder, currentSite: SiteType): string {
  const params = new URLSearchParams();
  
  if (currentSite !== 'all') {
    params.set('site', currentSite);
  }
  
  if (targetOrder !== 'latest') {
    params.set('order', targetOrder);
  }
  
  const queryString = params.toString();
  return queryString ? `/?${queryString}` : '/';
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
        <Link href={createSortUrl(SORT_ORDERS.latest, currentSearchParams.site)} prefetch={true}>
          <TabsTrigger
            value='new'
            className='data-[state=active]:bg-[#FAF9F5] data-[state=active]:text-[#141413] text-[#141413] font-medium w-full cursor-pointer'
          >
            新着
          </TabsTrigger>
        </Link>
        <Link href={createSortUrl(SORT_ORDERS.trending, currentSearchParams.site)} prefetch={true}>
          <TabsTrigger
            value='trending'
            className='data-[state=active]:bg-[#FAF9F5] data-[state=active]:text-[#141413] text-[#141413] font-medium w-full cursor-pointer'
          >
            トレンド
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  );
}
