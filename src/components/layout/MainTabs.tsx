import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SortOrder, SORT_ORDERS, SiteType } from '@/types/article';
import { createQueryUrl } from '@/lib/url-utils';

type Props = {
  order: SortOrder;
  currentSearchParams: {
    site: SiteType;
    order: SortOrder;
    q?: string;
  };
};

/**
 * メインタブコンポーネント
 * RSCでLinkベースのソート機能を提供
 */
export default function MainTabs({ order, currentSearchParams }: Props) {
  const currentTab = order === SORT_ORDERS.latest ? 'new' : 'trending';

  return (
    <Tabs value={currentTab}>
      <TabsList className='ai-themed-tabs-list grid w-full grid-cols-2 rounded-lg p-1'>
        <TabsTrigger value='new' asChild>
          <Link
            href={createQueryUrl({
              site: currentSearchParams.site,
              order: SORT_ORDERS.latest,
              query: currentSearchParams.q,
            })}
            prefetch={true}
            className='ai-themed-tabs-trigger font-medium w-full cursor-pointer flex items-center justify-center'
          >
            新着
          </Link>
        </TabsTrigger>
        <TabsTrigger value='trending' asChild>
          <Link
            href={createQueryUrl({
              site: currentSearchParams.site,
              order: SORT_ORDERS.trending,
              query: currentSearchParams.q,
            })}
            prefetch={true}
            className='ai-themed-tabs-trigger font-medium w-full cursor-pointer flex items-center justify-center'
          >
            トレンド
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
