/**
 * プロジェクト全体の定数定義
 */

import type { SiteConfig } from '@/types';
import { Globe, Zap, Book, Bookmark } from 'lucide-react';

/**
 * サイト設定
 */
export const SITE_CONFIGS: Record<string, SiteConfig> = {
  qiita: {
    id: 'qiita',
    name: 'qiita',
    displayName: 'Qiita',
    color: '#55C500',
    url: 'https://qiita.com',
  },
  zenn: {
    id: 'zenn',
    name: 'zenn',
    displayName: 'Zenn',
    color: '#3EA8FF',
    url: 'https://zenn.dev',
  },
  hatena: {
    id: 'hatena',
    name: 'hatena',
    displayName: 'はてな',
    color: '#025db8',
    url: 'https://b.hatena.ne.jp',
  },
} as const;

/**
 * UIコンポーネント用サイト設定
 */
export const SITE_UI_CONFIGS = {
  all: {
    label: 'すべて',
    icon: Globe,
    baseStyle:
      'border border-[#E0DFDA] bg-[#E0DFDA]/30 text-[var(--ai-primary)] hover:bg-[#E0DFDA]/50 hover:border-[#E0DFDA]/80',
    activeStyle:
      'bg-[var(--ai-primary)] text-white border-transparent hover:bg-[color-mix(in srgb,var(--ai-primary) 85%,white)]',
  },
  zenn: {
    label: 'Zenn',
    icon: Zap,
    baseStyle:
      'border border-[#E0DFDA] bg-[#E0DFDA]/30 text-[var(--ai-primary)] hover:bg-[#E0DFDA]/50 hover:border-[#E0DFDA]/80',
    activeStyle:
      'bg-[var(--ai-primary)] text-white border-transparent hover:bg-[color-mix(in srgb,var(--ai-primary) 85%,white)]',
  },
  qiita: {
    label: 'Qiita',
    icon: Book,
    baseStyle:
      'border border-[#E0DFDA] bg-[#E0DFDA]/30 text-[var(--ai-primary)] hover:bg-[#E0DFDA]/50 hover:border-[#E0DFDA]/80',
    activeStyle:
      'bg-[var(--ai-primary)] text-white border-transparent hover:bg-[color-mix(in srgb,var(--ai-primary) 85%,white)]',
  },
  hatena: {
    label: 'はてな',
    icon: Bookmark,
    baseStyle:
      'border border-[#E0DFDA] bg-[#E0DFDA]/30 text-[var(--ai-primary)] hover:bg-[#E0DFDA]/50 hover:border-[#E0DFDA]/80',
    activeStyle:
      'bg-[var(--ai-primary)] text-white border-transparent hover:bg-[color-mix(in srgb,var(--ai-primary) 85%,white)]',
  },
} as const;
