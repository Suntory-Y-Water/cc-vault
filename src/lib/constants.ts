/**
 * プロジェクト全体の定数定義
 */

import type { SiteConfig } from '@/types';

/**
 * カラーパレット
 */
export const COLORS = {
  primary: {
    orange: '#DB8163',
    white: '#FAF9F5',
    black: '#141413',
    gray: '#E0DFDA',
  },
  dark: {
    orange: '#E8956F',
    white: '#1A1A1A',
    black: '#FAF9F5',
    gray: '#2A2A2A',
  },
} as const;

/**
 * サイト設定
 */
export const SITE_CONFIGS: Record<string, SiteConfig> = {
  hatena: {
    id: 'hatena',
    name: 'hatena',
    displayName: 'はてなブックマーク',
    color: '#00A4DE',
    url: 'https://b.hatena.ne.jp',
    apiEndpoint: '/api/hatena',
  },
  qiita: {
    id: 'qiita',
    name: 'qiita',
    displayName: 'Qiita',
    color: '#55C500',
    url: 'https://qiita.com',
    apiEndpoint: '/api/qiita',
  },
  zenn: {
    id: 'zenn',
    name: 'zenn',
    displayName: 'Zenn',
    color: '#3EA8FF',
    url: 'https://zenn.dev',
    apiEndpoint: '/api/zenn',
  },
  note: {
    id: 'note',
    name: 'note',
    displayName: 'note',
    color: '#41C9B4',
    url: 'https://note.com',
    apiEndpoint: '/api/note',
  },
  docs: {
    id: 'docs',
    name: 'docs',
    displayName: '公式ドキュメント',
    color: '#FF6B35',
    url: 'https://docs.anthropic.com',
    apiEndpoint: '/api/docs',
  },
} as const;

/**
 * ページネーション設定
 */
export const PAGINATION = {
  defaultLimit: 20,
  maxLimit: 100,
} as const;

/**
 * キャッシュ設定
 */
export const CACHE = {
  articles: 3600, // 1時間
  weeklyReport: 86400, // 24時間
} as const;

/**
 * API設定
 */
export const API = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000,
} as const;

/**
 * 検索キーワード
 */
export const SEARCH_KEYWORDS = [
  'Claude Code',
  'Claude',
  'Anthropic',
  'AI',
  'コード生成',
  'プログラミング',
] as const;
