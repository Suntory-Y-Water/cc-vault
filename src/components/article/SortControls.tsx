import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { SortOrder } from '@/types';
import { Clock, TrendingUp } from 'lucide-react';

type SortControlsProps = {
  currentOrder: SortOrder;
  searchParams?: {
    site?: string;
    page?: string;
  };
};

/**
 * ソート制御コンポーネント
 * 新着順・トレンド順の切り替えを行う
 */
export default function SortControls({
  currentOrder,
  searchParams = {},
}: SortControlsProps) {
  return (
    <div className='flex items-center gap-2 mb-6'>
      <span className='text-sm text-[#141413] opacity-70 mr-2'>並び順:</span>

      <Link
        href={`?${new URLSearchParams({
          ...searchParams,
          order: 'latest',
          page: '1',
        }).toString()}`}
      >
        <Button
          variant={currentOrder === 'latest' ? 'default' : 'outline'}
          size='sm'
          className={
            currentOrder === 'latest'
              ? 'bg-[#DB8163] text-white border-[#DB8163] hover:bg-[#D97757]'
              : 'border-[#E0DFDA] text-[#141413] hover:bg-[#DB8163] hover:text-white hover:border-[#DB8163]'
          }
        >
          <Clock className='w-4 h-4 mr-1' />
          新着順
        </Button>
      </Link>

      <Link
        href={`?${new URLSearchParams({
          ...searchParams,
          order: 'trending',
          page: '1',
        }).toString()}`}
      >
        <Button
          variant={currentOrder === 'trending' ? 'default' : 'outline'}
          size='sm'
          className={
            currentOrder === 'trending'
              ? 'bg-[#DB8163] text-white border-[#DB8163] hover:bg-[#D97757]'
              : 'border-[#E0DFDA] text-[#141413] hover:bg-[#DB8163] hover:text-white hover:border-[#DB8163]'
          }
        >
          <TrendingUp className='w-4 h-4 mr-1' />
          トレンド順
        </Button>
      </Link>
    </div>
  );
}
