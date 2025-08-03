/**
 * 記事関連の型定義
 */

/**
 * サイト名の定数定義
 */
export const SITE_VALUES = ['qiita', 'zenn', 'hatena'] as const;
export const SITE_NAMES = {
  all: 'all',
  qiita: 'qiita',
  zenn: 'zenn',
  hatena: 'hatena',
} as const;

/**
 * はてなブックマークで個別に情報を取得するサイトの定義
 */
export const HATENA_SITE_DOMAIN = {
  NOTE: 'note.com',
  SPEAKERDECK: 'speakerdeck.com',
} as const;

/**
 * ソート順の定数定義
 */
export const SORT_ORDERS = {
  latest: 'latest',
  trending: 'trending',
} as const;

/**
 * DB格納用のサイト名型定義（実際のサイト名のみ）
 */
export type SiteValueType = (typeof SITE_VALUES)[number]; // "qiita" | "zenn" | "hatena"

/**
 * UI用のサイト名型定義（"all"を含む）
 */
export type SiteType = SiteValueType | 'all'; // "qiita" | "zenn" | "hatena" | "all"

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
  body: string; // 本文はMarkdown形式
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
  site: SiteValueType;
  likes: number;
  bookmarks: number;
};

/**
 * D1データベースのarticlesテーブルの行型定義
 */
export type ArticleD1Response = {
  success: boolean;
  errors?: string[];
  result: {
    results: ArticleRow[];
  }[];
};

/**
 * 記事ページネーション用のパラメータ型定義
 */
export type ArticlePaginationParams = {
  page: number;
  limit: number;
  site?: SiteType;
  order?: SortOrder;
};

/**
 * ページネーション結果の型定義
 */
export type PaginatedArticles = {
  articles: Article[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

/**
 * noteの記事データ型定義
 */
export type NoteArticle = {
  readonly data: Data;
};

type Data = {
  readonly key: string;
  readonly name: string;
  readonly body: string;
};
