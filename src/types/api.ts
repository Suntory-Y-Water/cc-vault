/**
 * API関連の型定義
 */

import type { Article } from './article';

export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type FetchOptions = {
  cache?: RequestCache;
  revalidate?: number;
  tags?: string[];
};

export type WeeklyReportData = {
  weekStart: string;
  weekEnd: string;
  topArticles: Article[];
  summary: string;
  totalArticles: number;
  totalEngagement: number;
};
