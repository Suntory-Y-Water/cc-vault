import Link from 'next/link';
import Image from 'next/image';
import SearchBox from '@/components/search/SearchBox';
import type { AIAgent } from '@/config/ai-agents';

type HeaderProps = {
  aiAgent: AIAgent;
};

/**
 * 共通ヘッダーコンポーネント
 * テナントのブランディング情報を受け取り、テーマカラーとテキストを動的に適用する
 */
export default function Header({ aiAgent }: HeaderProps) {
  const { branding } = aiAgent;

  return (
    <header
      className='sticky top-0 z-50 w-full border-b backdrop-blur-sm'
      data-ai-theme='surface'
      style={{
        backgroundColor:
          'color-mix(in srgb, var(--ai-background) 95%, transparent)',
        borderColor: 'color-mix(in srgb, var(--ai-accent) 60%, transparent)',
      }}
    >
      <div className='max-w-[80rem] mx-auto px-4 flex h-16 items-center justify-between gap-4'>
        <Link className='flex items-center gap-3 flex-shrink-0' href='/'>
          <Image
            src='/cc.svg'
            alt={`${branding.siteName} logo`}
            width={32}
            height={32}
            className='rounded-sm'
          />
          <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2'>
            <span className='text-lg sm:text-xl font-bold text-[color:var(--ai-text)]'>
              {branding.siteName}
            </span>
          </div>
        </Link>
        <SearchBox aiAgent={aiAgent} />
      </div>
    </header>
  );
}
