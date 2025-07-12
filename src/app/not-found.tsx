/**
 * 404エラー用ページコンポーネント
 */
export default function NotFound() {
  return (
    <div className='max-w-[80rem] mx-auto px-4 py-8'>
      <div className='flex flex-col items-center justify-center min-h-[60vh] gap-6'>
        <div className='text-center'>
          <h1 className='text-6xl font-extrabold tracking-tight text-[#141413] mb-4'>
            404
          </h1>
          <h2 className='text-2xl font-semibold text-[#141413] mb-2'>
            ページが見つかりません
          </h2>
          <p className='text-lg text-[#7D4A38]'>
            お探しのページは削除されたか、URLが間違っている可能性があります。
          </p>
        </div>
        <a
          href='/'
          className='px-6 py-3 bg-[#DB8163] text-white rounded-md hover:bg-[#D97757] transition-colors font-medium text-lg'
        >
          ホームに戻る
        </a>
      </div>
    </div>
  );
}
