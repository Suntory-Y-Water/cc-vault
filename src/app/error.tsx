'use client';

import { Button } from '@/components/ui/button';

/**
 * アプリケーション全体のエラーハンドリングコンポーネント
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-4'>
      <h2 className='text-xl font-semibold text-red-600'>
        エラーが発生しました
      </h2>
      <p className='text-gray-600'>
        {error.message || 'アプリケーションでエラーが発生しました。'}
      </p>
      <Button onClick={reset} className='bg-orange-500 hover:bg-orange-600'>
        再試行
      </Button>
    </div>
  );
}
