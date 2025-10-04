import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  searchParams?: {
    order?: 'latest' | 'trending';
    site?: string;
    q?: string;
  };
};

/**
 * ページネーションコンポーネント
 * 記事一覧のページ切り替えを行う
 */
export default function Pagination({
  currentPage,
  totalPages,
  hasNext,
  hasPrevious,
  searchParams = {},
}: PaginationProps) {
  /**
   * undefined値を除外したクリーンなsearchParamsを生成
   * @param additionalParams - 追加パラメータ
   * @returns クリーンなパラメータオブジェクト
   */
  const createCleanParams = (additionalParams: Record<string, string>) => {
    const cleanParams: Record<string, string> = {};

    // 既存のsearchParamsから undefined でない値のみを追加
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        cleanParams[key] = value;
      }
    });

    // 追加パラメータをマージ
    Object.entries(additionalParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        cleanParams[key] = value;
      }
    });

    return cleanParams;
  };

  const generatePageNumbers = () => {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxPagesToShow - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();
  const baseButtonClass =
    'border border-[var(--ai-secondary)] bg-[var(--ai-background)] text-[var(--ai-text)] hover:bg-[var(--ai-primary)] hover:text-white hover:border-[var(--ai-primary)] transition-colors duration-200';
  const disabledButtonClass =
    'border border-[var(--ai-secondary)] bg-[var(--ai-background)] text-[var(--ai-text)] opacity-50';
  const activeButtonClass = 'ai-themed-button border border-transparent';

  return (
    <div className='flex items-center justify-center gap-2 mt-8'>
      {/* 最初のページボタン */}
      {currentPage > 1 ? (
        <Link
          href={`?${new URLSearchParams(
            createCleanParams({ page: '1' }),
          ).toString()}`}
          prefetch={true}
        >
          <Button variant='outline' size='sm' className={baseButtonClass}>
            <ChevronsLeft className='w-4 h-4' />
          </Button>
        </Link>
      ) : (
        <Button
          variant='outline'
          size='sm'
          disabled
          className={disabledButtonClass}
        >
          <ChevronsLeft className='w-4 h-4' />
        </Button>
      )}

      {/* 前のページボタン */}
      {hasPrevious ? (
        <Link
          href={`?${new URLSearchParams(
            createCleanParams({ page: (currentPage - 1).toString() }),
          ).toString()}`}
          prefetch={true}
        >
          <Button variant='outline' size='sm' className={baseButtonClass}>
            &lt;
          </Button>
        </Link>
      ) : (
        <Button
          variant='outline'
          size='sm'
          disabled
          className={disabledButtonClass}
        >
          &lt;
        </Button>
      )}

      {/* ページ番号 */}
      <div className='flex items-center gap-1'>
        {pageNumbers.map((pageNumber) => (
          <Link
            key={pageNumber}
            href={`?${new URLSearchParams(
              createCleanParams({ page: pageNumber.toString() }),
            ).toString()}`}
            prefetch={true}
          >
            <Button
              variant='outline'
              size='sm'
              className={
                currentPage === pageNumber ? activeButtonClass : baseButtonClass
              }
              aria-current={currentPage === pageNumber ? 'page' : undefined}
            >
              {pageNumber}
            </Button>
          </Link>
        ))}
      </div>

      {/* 次のページボタン */}
      {hasNext ? (
        <Link
          href={`?${new URLSearchParams(
            createCleanParams({ page: (currentPage + 1).toString() }),
          ).toString()}`}
          prefetch={true}
        >
          <Button variant='outline' size='sm' className={baseButtonClass}>
            &gt;
          </Button>
        </Link>
      ) : (
        <Button
          variant='outline'
          size='sm'
          disabled
          className={disabledButtonClass}
        >
          &gt;
        </Button>
      )}

      {/* 最後のページボタン */}
      {currentPage < totalPages ? (
        <Link
          href={`?${new URLSearchParams(
            createCleanParams({ page: totalPages.toString() }),
          ).toString()}`}
          prefetch={true}
        >
          <Button variant='outline' size='sm' className={baseButtonClass}>
            <ChevronsRight className='w-4 h-4' />
          </Button>
        </Link>
      ) : (
        <Button
          variant='outline'
          size='sm'
          disabled
          className={disabledButtonClass}
        >
          <ChevronsRight className='w-4 h-4' />
        </Button>
      )}
    </div>
  );
}
