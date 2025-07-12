import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
      {/* 前のページボタン */}
      {hasPrevious ? (
        <Link
          href={`?${new URLSearchParams({
            ...searchParams,
            page: (currentPage - 1).toString(),
          }).toString()}`}
        >
          <Button
            variant='outline'
            size='sm'
            className='border-[#E0DFDA] text-[#141413] hover:bg-[#DB8163] hover:text-white hover:border-[#DB8163]'
          >
            <ChevronLeft className='w-4 h-4 mr-1' />
            前へ
          </Button>
        </Link>
      ) : (
        <Button
          variant='outline'
          size='sm'
          disabled
          className='border-[#E0DFDA] text-[#141413] opacity-50'
        >
          <ChevronLeft className='w-4 h-4 mr-1' />
          前へ
        </Button>
      )}

      {/* ページ番号 */}
      <div className='flex items-center gap-1'>
        {pageNumbers.map((pageNumber) => (
          <Link
            key={pageNumber}
            href={`?${new URLSearchParams({
              ...searchParams,
              page: pageNumber.toString(),
            }).toString()}`}
          >
            <Button
              variant={currentPage === pageNumber ? 'default' : 'outline'}
              size='sm'
              className={
                currentPage === pageNumber
                  ? 'bg-[#DB8163] text-white border-[#DB8163] hover:bg-[#D97757]'
                  : 'border-[#E0DFDA] text-[#141413] hover:bg-[#DB8163] hover:text-white hover:border-[#DB8163]'
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
          href={`?${new URLSearchParams({
            ...searchParams,
            page: (currentPage + 1).toString(),
          }).toString()}`}
        >
          <Button
            variant='outline'
            size='sm'
            className='border-[#E0DFDA] text-[#141413] hover:bg-[#DB8163] hover:text-white hover:border-[#DB8163]'
          >
            次へ
            <ChevronRight className='w-4 h-4 ml-1' />
          </Button>
        </Link>
      ) : (
        <Button
          variant='outline'
          size='sm'
          disabled
          className='border-[#E0DFDA] text-[#141413] opacity-50'
        >
          次へ
          <ChevronRight className='w-4 h-4 ml-1' />
        </Button>
      )}
    </div>
  );
}
