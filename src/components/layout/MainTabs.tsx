import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Props = {
  order: 'latest' | 'trending';
  searchParams?: {
    site?: string;
    page?: string;
  };
};

/**
 * メインタブコンポーネント
 * 新着・トレンドタブの切り替え機能を提供
 */
export default function MainTabs({ order, searchParams = {} }: Props) {
  const currentTab = order === 'latest' ? 'new' : 'trending';

  return (
    <Tabs value={currentTab}>
      <TabsList className='grid w-full grid-cols-2 bg-[#E0DFDA] rounded-lg p-1'>
        <Link
          href={`?${new URLSearchParams({
            ...searchParams,
            order: 'latest',
            page: '1',
          }).toString()}`}
        >
          <TabsTrigger
            value='new'
            className='data-[state=active]:bg-[#FAF9F5] data-[state=active]:text-[#141413] text-[#141413] font-medium w-full'
          >
            新着
          </TabsTrigger>
        </Link>
        <Link
          href={`?${new URLSearchParams({
            ...searchParams,
            order: 'trending',
            page: '1',
          }).toString()}`}
        >
          <TabsTrigger
            value='trending'
            className='data-[state=active]:bg-[#FAF9F5] data-[state=active]:text-[#141413] text-[#141413] font-medium w-full'
          >
            トレンド
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  );
}
