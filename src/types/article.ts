/**
 * 記事関連の型定義
 */

export type Article = {
  id: string;
  title: string;
  url: string;
  author: string;
  publishedAt: string;
  site: SiteType;
  engagement: EngagementMetrics;
  description?: string;
  tags?: string[];
};

export type EngagementMetrics = {
  likes: number;
  bookmarks: number;
};

export type SiteType = 'hatena' | 'qiita' | 'zenn' | 'note' | 'docs';

export type SortOrder = 'latest' | 'trending';

export type ArticleFilters = {
  order: SortOrder;
  site: SiteType | 'all';
  page: number;
};

export type ArticleResponse = {
  articles: Article[];
  totalCount: number;
  hasNext: boolean;
  currentPage: number;
};

export type ZennResponse = {
  articles: ZennPost[];
};

export type ZennPost = {
  id: number;
  path: string;
  emoji: string;
  title: string;
  published_at: string;
};
