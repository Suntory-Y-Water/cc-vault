import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { WeekRange } from '@/types';
import { isFutureWeek, generateMockWeeklyArticles } from '@/lib/weekly-report';

type WeekNavigationProps = {
  /** 現在の週の範囲 */
  currentWeek: WeekRange;
  /** 前の週の範囲 */
  previousWeek: WeekRange;
  /** 次の週の範囲 */
  nextWeek: WeekRange;
};

/**
 * 週間ナビゲーションコンポーネント
 * 前週・次週への移動機能を提供するServerComponent
 */
export default function WeekNavigation({
  currentWeek,
  previousWeek,
  nextWeek,
}: WeekNavigationProps) {
  return (
    <div className='flex items-center justify-between mb-6'>
      {/* 前の週ボタン */}
      {generateMockWeeklyArticles(previousWeek).length === 0 ? (
        <Button
          variant='outline'
          size='sm'
          disabled
          className='border-[#E0DFDA] text-[#141413] opacity-50'
        >
          <ChevronLeft className='w-4 h-4 mr-1' />
          前の週
        </Button>
      ) : (
        <Link href={`/weekly-report?week=${previousWeek.startDate}`}>
          <Button
            variant='outline'
            size='sm'
            className='border-[#E0DFDA] text-[#141413] hover:bg-[#DB8163] hover:text-white hover:border-[#DB8163]'
          >
            <ChevronLeft className='w-4 h-4 mr-1' />
            前の週
          </Button>
        </Link>
      )}

      {/* 現在の週の表示 */}
      <div className='text-center'>
        <h2 className='text-lg font-semibold text-[#141413]'>
          {currentWeek.label}
        </h2>
        <p className='text-sm text-[#141413] opacity-70'>
          {currentWeek.startDate} - {currentWeek.endDate}
        </p>
      </div>

      {/* 次の週ボタン */}
      {isFutureWeek(nextWeek.startDate) ||
      generateMockWeeklyArticles(nextWeek).length === 0 ? (
        <Button
          variant='outline'
          size='sm'
          disabled
          className='border-[#E0DFDA] text-[#141413] opacity-50'
        >
          次の週
          <ChevronRight className='w-4 h-4 ml-1' />
        </Button>
      ) : (
        <Link href={`/weekly-report?week=${nextWeek.startDate}`}>
          <Button
            variant='outline'
            size='sm'
            className='border-[#E0DFDA] text-[#141413] hover:bg-[#DB8163] hover:text-white hover:border-[#DB8163]'
          >
            次の週
            <ChevronRight className='w-4 h-4 ml-1' />
          </Button>
        </Link>
      )}
    </div>
  );
}
