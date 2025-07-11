/**
 * 404エラー用ページコンポーネント
 */
export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-4'>
      <h2 className='text-2xl font-semibold text-gray-800'>
        404 - Page Not Found
      </h2>
      <p className='text-gray-600'>お探しのページが見つかりません。</p>
      <a
        href='/'
        className='px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors'
      >
        ホームに戻る
      </a>
    </div>
  );
}
