'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SortOrder, SORT_ORDERS } from '@/types/article';

type Props = {
  order: SortOrder;
  onOrderChange: (order: SortOrder) => void;
};

/**
 * メインタブコンポーネント (Client Component)
 * 新着・トレンドタブの切り替え機能を提供
 */
export default function MainTabs({ order, onOrderChange }: Props) {
  const currentTab = order === SORT_ORDERS.latest ? 'new' : 'trending';

  return (
    <Tabs value={currentTab}>
      <TabsList className='grid w-full grid-cols-2 bg-[#E0DFDA] rounded-lg p-1'>
        <TabsTrigger
          value='new'
          onClick={() => onOrderChange(SORT_ORDERS.latest)}
          className='data-[state=active]:bg-[#FAF9F5] data-[state=active]:text-[#141413] text-[#141413] font-medium w-full cursor-pointer'
        >
          新着
        </TabsTrigger>
        <TabsTrigger
          value='trending'
          onClick={() => onOrderChange(SORT_ORDERS.trending)}
          className='data-[state=active]:bg-[#FAF9F5] data-[state=active]:text-[#141413] text-[#141413] font-medium w-full cursor-pointer'
        >
          トレンド
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
