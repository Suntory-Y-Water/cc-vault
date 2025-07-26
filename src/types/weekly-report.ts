/**
 * ウィークリーレポート関連の型定義
 */

import type { Article } from './article';

/**
 * 週の範囲を表す型
 */
export type WeekRange = {
  /** 週の開始日 */
  startDate: string;
  /** 週の終了日 */
  endDate: string;
  /** 年 */
  year: number;
  /** 週番号 */
  weekNumber: number;
  /** 表示用ラベル */
  label: string;
};

/**
 * 週間記事データ
 */
export type WeeklyArticle = Article & {
  /** 週間でのランキング順位 */
  weeklyRank: number;
};

/**
 * 週間レポート全体のデータ
 */
export type WeeklyReport = {
  /** 週の範囲 */
  weekRange: WeekRange;
  /** 週間人気記事トップ10 */
  topArticles: WeeklyArticle[];
};

/**
 * ウィークリーレポートページのprops
 */
export type WeeklyReportPageProps = {
  searchParams: Promise<{
    /** 週の指定（yyyy-mm-dd形式の開始日） */
    week?: string;
    /** 年の指定 */
    year?: string;
    /** 週番号の指定 */
    weekNumber?: string;
  }>;
};

/**
 * 週次処理用の記事データ型
 */
export type WeeklyProcessingArticle = {
  id: string;
  title: string;
  url: string;
  author: string;
  publishedAt: string;
  content: string;
  likes: number;
  bookmarks: number;
  ranking: number;
};

/**
 * 週次処理用のJSON入力型
 */
export type WeeklyProcessingInput = {
  weekRange: {
    startDate: string;
    endDate: string;
    weekNumber: number;
  };
  articles: WeeklyProcessingArticle[];
};
