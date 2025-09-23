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
      'border border-[var(--ai-secondary)] bg-[var(--ai-background)] text-[var(--ai-text)] hover:bg-[var(--ai-primary)] hover:text-white hover:border-[var(--ai-primary)] transition-colors duration-200',
    activeStyle: 'ai-themed-button border-transparent',
  },
  zenn: {
    label: 'Zenn',
    icon: Zap,
    baseStyle:
      'border border-[var(--ai-secondary)] bg-[var(--ai-background)] text-[var(--ai-text)] hover:bg-[var(--ai-primary)] hover:text-white hover:border-[var(--ai-primary)] transition-colors duration-200',
    activeStyle: 'ai-themed-button border-transparent',
  },
  qiita: {
    label: 'Qiita',
    icon: Book,
    baseStyle:
      'border border-[var(--ai-secondary)] bg-[var(--ai-background)] text-[var(--ai-text)] hover:bg-[var(--ai-primary)] hover:text-white hover:border-[var(--ai-primary)] transition-colors duration-200',
    activeStyle: 'ai-themed-button border-transparent',
  },
  hatena: {
    label: 'はてな',
    icon: Bookmark,
    baseStyle:
      'border border-[var(--ai-secondary)] bg-[var(--ai-background)] text-[var(--ai-text)] hover:bg-[var(--ai-primary)] hover:text-white hover:border-[var(--ai-primary)] transition-colors duration-200',
    activeStyle: 'ai-themed-button border-transparent',
  },
} as const;
