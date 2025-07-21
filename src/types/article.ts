/**
 * 記事関連の型定義
 */

/**
 * サイト名の定数定義
 */
export const SITE_NAMES = {
  all: 'all',
  qiita: 'qiita',
  zenn: 'zenn',
  hatena: 'hatena',
} as const;

/**
 * ソート順の定数定義
 */
export const SORT_ORDERS = {
  latest: 'latest',
  trending: 'trending',
} as const;

/**
 * サイト名の型定義
 */
export type SiteType = keyof typeof SITE_NAMES;

/**
 * ソート順の型定義
 */
export type SortOrder = keyof typeof SORT_ORDERS;

export type Article = {
  id: string;
  title: string;
  url: string;
  author: string;
  publishedAt: string;
  site: SiteType;
  engagement: EngagementMetrics;
};

type EngagementMetrics = {
  likes: number;
  bookmarks: number;
};

export type ZennResponse = {
  articles: ZennPost[];
};

export type ZennPost = {
  id: number;
  path: string;
  title: string;
  author: string;
  published_at: string;
  likedCount: number;
  bookmarkedCount: number;
};

/**
 * QiitaAPIの記事データ
 */
export type QiitaPost = {
  id: string;
  title: string;
  url: string;
  likes_count: number;
  stocks_count: number;
  created_at: string;
  user: {
    id: string;
    // 設定されているけど""な場合がある
    name: string;
  };
};

/**
 * D1データベースのarticlesテーブルの行型定義
 */
export type ArticleRow = {
  id: string;
  title: string;
  url: string;
  author: string;
  published_at: string;
  site: string;
  likes: number;
  bookmarks: number;
  created_at: string;
  updated_at: string;
};
