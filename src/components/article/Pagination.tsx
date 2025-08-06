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
          <Button
            variant='outline'
            size='sm'
            className='border-[#E0DFDA] text-[#141413] hover:bg-[#F4A382] hover:text-white hover:border-[#F4A382]'
          >
            <ChevronsLeft className='w-4 h-4' />
          </Button>
        </Link>
      ) : (
        <Button
          variant='outline'
          size='sm'
          disabled
          className='border-[#E0DFDA] text-[#141413] opacity-50'
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
          <Button
            variant='outline'
            size='sm'
            className='border-[#E0DFDA] text-[#141413] hover:bg-[#F4A382] hover:text-white hover:border-[#F4A382]'
          >
            &lt;
          </Button>
        </Link>
      ) : (
        <Button
          variant='outline'
          size='sm'
          disabled
          className='border-[#E0DFDA] text-[#141413] opacity-50'
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
              variant={currentPage === pageNumber ? 'default' : 'outline'}
              size='sm'
              className={
                currentPage === pageNumber
                  ? 'bg-[#DB8163] text-white border-[#DB8163] hover:bg-[#D97757]'
                  : 'border-[#E0DFDA] text-[#141413] hover:bg-[#F4A382] hover:text-white hover:border-[#F4A382]'
              }
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
          <Button
            variant='outline'
            size='sm'
            className='border-[#E0DFDA] text-[#141413] hover:bg-[#F4A382] hover:text-white hover:border-[#F4A382]'
          >
            &gt;
          </Button>
        </Link>
      ) : (
        <Button
          variant='outline'
          size='sm'
          disabled
          className='border-[#E0DFDA] text-[#141413] opacity-50'
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
          <Button
            variant='outline'
            size='sm'
            className='border-[#E0DFDA] text-[#141413] hover:bg-[#F4A382] hover:text-white hover:border-[#F4A382]'
          >
            <ChevronsRight className='w-4 h-4' />
          </Button>
        </Link>
      ) : (
        <Button
          variant='outline'
          size='sm'
          disabled
          className='border-[#E0DFDA] text-[#141413] opacity-50'
        >
          <ChevronsRight className='w-4 h-4' />
        </Button>
      )}
    </div>
  );
}
