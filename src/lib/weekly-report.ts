/**
 * ウィークリーレポート関連のユーティリティ関数（シンプル版）
 */

import {
  startOfWeek,
  endOfWeek,
  addWeeks,
  getWeek,
  getYear,
  isAfter,
  isSameDay,
  parseISO,
  format,
} from 'date-fns';
import type { WeekRange, WeeklyReportGrouped, SiteRanking } from '@/types';
import { SITE_VALUES } from '@/types/article';
import { hasWeeklyReportData, fetchWeeklyDisplayData } from './cloudflare';

/**
 * 指定された日付から週の開始日を取得（月曜日始まり）
 */
export function getStartOfWeek(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

/**
 * 指定された日付から週の終了日を取得（月曜日始まり）
 */
export function getEndOfWeek(date: Date): Date {
  return endOfWeek(date, { weekStartsOn: 1 });
}

/**
 * 週の範囲を生成
 */
export function createWeekRange(startDate: Date): WeekRange {
  const start = getStartOfWeek(startDate);
  const end = getEndOfWeek(startDate);

  const year = getYear(start);
  const weekNumber = getWeek(start, { weekStartsOn: 1 });

  return {
    startDate: format(start, 'yyyy-MM-dd'),
    endDate: format(end, 'yyyy-MM-dd'),
    year,
    weekNumber,
    label: `#${weekNumber}`,
  };
}

/**
 * 前週・次週の週範囲を取得
 */
export function getAdjacentWeeks(currentWeek: string): {
  previous: WeekRange;
  next: WeekRange;
} {
  const current = parseISO(currentWeek);

  // 前週（1週間前）
  const previousWeekDate = addWeeks(current, -1);
  const previousWeekStart = startOfWeek(previousWeekDate, { weekStartsOn: 1 });

  // 次週（1週間後）
  const nextWeekDate = addWeeks(current, 1);
  const nextWeekStart = startOfWeek(nextWeekDate, { weekStartsOn: 1 });

  return {
    previous: createWeekRange(previousWeekStart),
    next: createWeekRange(nextWeekStart),
  };
}

/**
 * 現在の週が最新の週かどうかを判定
 */
export function isCurrentWeek(weekStartDate: string): boolean {
  const today = new Date();
  const currentWeekStart = getStartOfWeek(today);
  const targetWeekStart = parseISO(weekStartDate);

  return isSameDay(currentWeekStart, targetWeekStart);
}

/**
 * 指定された週が未来の週かどうかを判定
 */
export function isFutureWeek(weekStartDate: string): boolean {
  const today = new Date();
  const currentWeekStart = getStartOfWeek(today);
  const targetWeekStart = parseISO(weekStartDate);

  return isAfter(targetWeekStart, currentWeekStart);
}

/**
 * 週間レポートのデータを取得（サイト別に整理済み）
 * weeklySummariesテーブルとarticlesテーブルのINNER JOINで画面表示用データを取得
 */
export async function fetchWeeklyReportData({
  weekRange,
  db,
}: {
  weekRange: WeekRange;
  db: D1Database;
}): Promise<SiteRanking[]> {
  try {
    return await Promise.all(
      SITE_VALUES.map(async (site) => {
        const articles = await fetchWeeklyDisplayData({
          db,
          site,
          weekStartDate: weekRange.startDate,
        });
        return {
          site,
          articles: articles.map((article, index) => ({
            id: article.id,
            title: article.title,
            url: article.url,
            author: article.author,
            publishedAt: article.publishedAt,
            site: article.site,
            summary: article.summary, // AI要約を追加
            engagement: {
              likes: article.likesSnapshot, // Snapshot値を使用
              bookmarks: article.bookmarksSnapshot, // Snapshot値を使用
            },
            weeklyRank: index + 1,
          })),
        };
      }),
    );
  } catch (error) {
    console.error('週間レポートデータの取得に失敗しました:', error);
    return [];
  }
}

/**
 * サイト別グループ化された週間レポートデータを生成
 */
export async function generateWeeklyReportGrouped({
  weekStartDate,
  db,
}: {
  weekStartDate: string;
  db: D1Database;
}): Promise<WeeklyReportGrouped> {
  const weekRange = createWeekRange(new Date(weekStartDate));
  const siteRankings = await fetchWeeklyReportData({ weekRange, db });

  return {
    weekRange,
    siteRankings,
  };
}

/**
 * UTCの日時をJST（Asia/Tokyo）に変換
 *
 * TODO: この関数は危険な手動計算を行っており、以下の問題がある
 * - サマータイム（DST）を考慮できない
 * - うるう秒やタイムゾーンオフセット変更に対応できない
 * - toZonedTimeは表示用で計算には不適切
 *
 * 推奨対応：
 * 1. 計算ロジックをUTCベースに変更
 * 2. 表示時のみformatInTimeZoneやtoLocaleStringを使用
 * 3. この関数自体の削除を検討
 */
export function convertUTCToJST(utcDate: Date): Date {
  // FIXME: 危険な手動計算 - サマータイム等を考慮できない
  const jstTimestamp = utcDate.getTime() + 9 * 60 * 60 * 1000;
  return new Date(jstTimestamp);
}

/**
 * JST基準で前週の週範囲を計算
 */
export function calculatePreviousWeek(jstDate: Date): WeekRange {
  const previousWeekDate = addWeeks(jstDate, -1);
  return createWeekRange(previousWeekDate);
}

/**
 * 指定週のウィークリーレポートデータが存在するかチェック（公開関数）
 * @param weekRange - 週範囲オブジェクト
 * @param db - D1データベースインスタンス
 * @returns データが存在する場合true
 */
export async function hasWeeklyData(
  weekRange: WeekRange,
  db: D1Database,
): Promise<boolean> {
  return await hasWeeklyReportData({
    db,
    weekStartDate: weekRange.startDate,
  });
}
