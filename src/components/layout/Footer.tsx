import Link from 'next/link';
import type { AIAgent } from '@/config/ai-agents';

/**
 * 共通フッターコンポーネント
 * 全ページで使用される共通のフッター部分
 */
type FooterProps = {
  aiAgent: Pick<AIAgent, 'branding' | 'colors'>;
};

export default function Footer({ aiAgent }: FooterProps) {
  const { branding } = aiAgent;

  return (
    <footer className='border-t border-[color:var(--ai-accent)]/30 bg-[var(--ai-background)]'>
      <div className='max-w-[80rem] mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div>
            <h3 className='mb-4 text-sm font-semibold'>サービス</h3>
            <ul className='flex flex-col gap-2 text-sm text-[color:var(--ai-text)]/70'>
              <li>
                <Link
                  href='/features'
                  className='transition-colors hover:text-[var(--ai-primary)]'
                >
                  機能紹介
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='mb-4 text-sm font-semibold'>サポート</h3>
            <ul className='flex flex-col gap-2 text-sm text-[color:var(--ai-text)]/70'>
              <li>
                <Link
                  href='/help'
                  className='transition-colors hover:text-[var(--ai-primary)]'
                >
                  ヘルプセンター
                </Link>
              </li>
              <li>
                <Link
                  href='/terms'
                  className='transition-colors hover:text-[var(--ai-primary)]'
                >
                  利用規約
                </Link>
              </li>
              <li>
                <Link
                  href='/privacy'
                  className='transition-colors hover:text-[var(--ai-primary)]'
                >
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='mb-4 text-sm font-semibold'>その他</h3>
            <ul className='flex flex-col gap-2 text-sm text-[color:var(--ai-text)]/70'>
              <li>
                <a
                  href='https://x.com/Suntory_N_Water'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='transition-colors hover:text-[var(--ai-primary)]'
                >
                  開発者へのお問い合わせ
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className='mt-8 border-t border-[color:var(--ai-accent)]/30 pt-8 text-center text-sm text-[color:var(--ai-text)]/70'>
          © 2025 {branding.siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
