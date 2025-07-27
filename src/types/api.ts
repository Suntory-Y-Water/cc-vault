/**
 * API関連の型定義
 */

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type FetchOptions = {
  cache?: RequestCache;
  revalidate?: number;
  tags?: string[];
};
