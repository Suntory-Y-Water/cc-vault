import Link from 'next/link';

/**
 * 共通フッターコンポーネント
 * 全ページで使用される共通のフッター部分
 */
export default function Footer() {
  return (
    <footer className='border-t border-[#E0DFDA] bg-[#FAF9F5]'>
      <div className='max-w-[80rem] mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div>
            <h3 className='mb-4 text-sm font-semibold'>サービス</h3>
            <ul className='flex flex-col gap-2 text-sm text-[#7D4A38]'>
              <li>
                <Link
                  href='/features'
                  className='transition-colors hover:text-[#141413]'
                >
                  機能紹介
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='mb-4 text-sm font-semibold'>サポート</h3>
            <ul className='flex flex-col gap-2 text-sm text-[#7D4A38]'>
              <li>
                <Link
                  href='/help'
                  className='transition-colors hover:text-[#141413]'
                >
                  ヘルプセンター
                </Link>
              </li>
              <li>
                <Link
                  href='/terms'
                  className='transition-colors hover:text-[#141413]'
                >
                  利用規約
                </Link>
              </li>
              <li>
                <Link
                  href='/privacy'
                  className='transition-colors hover:text-[#141413]'
                >
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='mb-4 text-sm font-semibold'>その他</h3>
            <ul className='flex flex-col gap-2 text-sm text-[#7D4A38]'>
              <li>
                <a
                  href='https://x.com/Suntory_N_Water'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='transition-colors hover:text-[#141413]'
                >
                  開発者へのお問い合わせ
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className='mt-8 border-t border-[#E0DFDA] pt-8 text-center text-sm text-[#7D4A38]'>
          © 2025 CC-Vault. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
