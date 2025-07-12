/**
 * プロジェクト全体の定数定義
 */

import type { SiteConfig } from '@/types';
import { Globe, Zap, Book } from 'lucide-react';

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
} as const;

/**
 * UIコンポーネント用サイト設定
 */
export const SITE_UI_CONFIGS = {
  all: {
    label: 'すべて',
    icon: Globe,
    baseStyle:
      'border border-[#E0DFDA] bg-[#E0DFDA]/30 text-[#7D4A38] hover:bg-[#E0DFDA]/50 hover:border-[#E0DFDA]/80',
    activeStyle: 'bg-[#DB8163] text-white border-transparent',
  },
  zenn: {
    label: 'Zenn',
    icon: Zap,
    baseStyle:
      'border border-[#E0DFDA] bg-[#E0DFDA]/30 text-[#7D4A38] hover:bg-[#E0DFDA]/50 hover:border-[#E0DFDA]/80',
    activeStyle: 'bg-[#DB8163] text-white border-transparent',
  },
  qiita: {
    label: 'Qiita',
    icon: Book,
    baseStyle:
      'border border-[#E0DFDA] bg-[#E0DFDA]/30 text-[#7D4A38] hover:bg-[#E0DFDA]/50 hover:border-[#E0DFDA]/80',
    activeStyle: 'bg-[#DB8163] text-white border-transparent',
  },
} as const;
