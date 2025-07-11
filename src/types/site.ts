/**
 * サイト関連の型定義
 */

export type SiteConfig = {
  id: string;
  name: string;
  displayName: string;
  color: string;
  url: string;
  apiEndpoint?: string;
};

export type SiteStats = {
  siteId: string;
  articleCount: number;
  totalEngagement: number;
  lastUpdated: string;
};

export type SiteFilterOption =
  | 'all'
  | 'hatena'
  | 'qiita'
  | 'zenn'
  | 'note'
  | 'docs';
