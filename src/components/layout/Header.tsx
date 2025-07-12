import Link from 'next/link';
import Image from 'next/image';

/**
 * 共通ヘッダーコンポーネント
 * 全ページで使用される共通のヘッダー部分
 */
export default function Header() {
  return (
    <header className='sticky top-0 z-50 w-full border-b border-[#E0DFDA] bg-[#FAF9F5]/95 backdrop-blur-sm'>
      <div className='max-w-[80rem] mx-auto px-4 flex h-16 items-center justify-between'>
        <Link className='flex items-center gap-2' href='/'>
          <Image
            src='/cc.svg'
            alt='CC-Vault logo'
            width={32}
            height={32}
            className='rounded-sm'
          />
          <span className='text-xl font-bold bg-gradient-to-r from-[#141413] to-[#141413]/80 bg-clip-text text-transparent'>
            CC-Vault
          </span>
        </Link>
      </div>
    </header>
  );
}
