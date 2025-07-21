import { redirect } from 'next/navigation';

/**
 * ホームページコンポーネント
 * データ取得をサーバーサイドで実行し、結果をClient Componentに渡す
 */
export default async function HomePage() {
  redirect('https://cc-vault.ayasnppk00.workers.dev');
  return (
    <div className='max-w-[80rem] mx-auto px-4 py-8'>
      このページはredirectしました。
    </div>
  );
}
