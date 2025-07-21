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
  hatena: {
    label: 'はてな',
    icon: Bookmark,
    baseStyle:
      'border border-[#E0DFDA] bg-[#E0DFDA]/30 text-[#7D4A38] hover:bg-[#E0DFDA]/50 hover:border-[#E0DFDA]/80',
    activeStyle: 'bg-[#DB8163] text-white border-transparent',
  },
} as const;

/**
 * はてなブログのClaude Code表記揺れパターン
 */
export const HATENA_CLAUDE_CODE_VARIANTS = [
  'claudecode',
  '"claudecode"',
  'claude code',
  '"claude code"',
  'claude-code',
  '"claude-code"',
] as const;

/**
 * ZennとQiitaのドメインパターン（はてなデータから除外用）
 */
export const EXCLUDE_DOMAINS = [
  'https://zenn.dev/',
  'https://qiita.com/',
] as const;
