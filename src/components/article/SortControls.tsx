import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { SortOrder } from '@/types';
import { Clock, TrendingUp } from 'lucide-react';
import type { CSSProperties } from 'react';

type SortControlsProps = {
  currentOrder: SortOrder;
  searchParams?: {
    site?: string;
    page?: string;
  };
  /** AIエージェントテーマスタイル */
  themeStyles?: CSSProperties;
};

/**
 * ソート制御コンポーネント
 * 新着順・トレンド順の切り替えを行う
 */
export default function SortControls({
  currentOrder,
  searchParams = {},
  themeStyles,
}: SortControlsProps) {
  return (
    <div className='flex items-center gap-2 mb-6' style={themeStyles}>
      <span className='text-sm text-[var(--ai-text)] opacity-70 mr-2'>
        並び順:
      </span>

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
              ? 'bg-[var(--ai-primary)] text-white border-[var(--ai-primary)] hover:bg-[var(--ai-primary-hover)]'
              : 'border-[#E0DFDA] text-[var(--ai-text)] hover:bg-[var(--ai-primary)] hover:text-white hover:border-[var(--ai-primary)]'
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
              ? 'bg-[var(--ai-primary)] text-white border-[var(--ai-primary)] hover:bg-[var(--ai-primary-hover)]'
              : 'border-[#E0DFDA] text-[var(--ai-text)] hover:bg-[var(--ai-primary)] hover:text-white hover:border-[var(--ai-primary)]'
          }
        >
          <TrendingUp className='w-4 h-4 mr-1' />
          トレンド順
        </Button>
      </Link>
    </div>
  );
}
