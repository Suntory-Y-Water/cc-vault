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
  /** AI生成要約 */
  summary: string;
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
 * サイト別ランキングデータ
 */
export type SiteRanking = {
  /** サイト名 */
  site: string;
  /** サイトの記事（1-3位） */
  articles: WeeklyArticle[];
};

/**
 * サイト別にグループ化された週間レポートデータ
 */
export type WeeklyReportGrouped = {
  /** 週の範囲 */
  weekRange: WeekRange;
  /** サイト別ランキング */
  siteRankings: SiteRanking[];
};

/**
 * ウィークリーレポートページのprops
 */
export type WeeklyReportPageProps = {
  searchParams: Promise<{
    /** 週の指定（yyyy-mm-dd形式の開始日） */
    week?: string;
  }>;
};
