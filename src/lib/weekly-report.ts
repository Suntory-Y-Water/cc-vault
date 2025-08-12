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
  parseISO,
  format,
  isValid,
} from 'date-fns';
import type { WeekRange, WeeklyReportGrouped } from '@/types';
import { fetchWeeklyOverallSummary, fetchWeeklyReportData } from './cloudflare';
import { TZDate } from '@date-fns/tz';

/**
 * 指定された日付から週の開始日を取得（月曜日始まり）
 * プロジェクト全体で統一された週の開始日の定義
 */
export function getStartOfWeek(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

/**
 * 日付をyyyy-MM-dd形式の文字列にフォーマット
 * プロジェクト全体で統一された日付文字列形式の定義
 */
export function formatDateToString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * 日付を年月日表示にフォーマット（例：2024年12月25日）
 * ユーザー向け表示用の日本語日付フォーマット
 */
export function formatDateToJapanese(date: string): string {
  const dateObj = parseISO(date);
  return format(dateObj, 'yyyy年M月d日');
}

/**
 * 現在の日時をJST（Asia/Tokyo）で取得
 */
export function getCurrentJSTDate(): TZDate {
  // 現在時刻をJSTタイムゾーンでTZDateとして作成
  const jstNow = TZDate.tz('Asia/Tokyo');

  // TZDateは正確なJST時刻を保持し、Date互換のオブジェクトを返却
  return jstNow;
}

/**
 * 現在のJST日時をISO8601形式の文字列で取得
 * データベースのcreated_at/updated_atフィールド用
 */
export function getCurrentJSTDateTimeString(): string {
  const jstDate = getCurrentJSTDate();
  // JST日時を手動でISO形式の文字列に変換（UTCに戻らない）
  return format(jstDate, "yyyy-MM-dd'T'HH:mm:ss");
}

/**
 * 指定された日付から週の終了日を取得（月曜日始まり）
 * プロジェクト全体で統一された週の終了日の定義
 */
export function getEndOfWeek(date: Date): Date {
  return endOfWeek(date, { weekStartsOn: 1 });
}

/**
 * 日付文字列の有効性を検証
 * YYYY-MM-DD形式の有効な日付文字列かどうかを判定
 */
export function isValidDateString(dateString: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }

  return isValid(parseISO(dateString));
}

/**
 * 週の範囲を生成
 * 指定された日付を含む週の開始日・終了日・年・週番号・ラベルを計算
 */
function createWeekRange(startDate: Date): WeekRange {
  const start = getStartOfWeek(startDate);
  const end = getEndOfWeek(startDate);

  const year = getYear(start);
  const weekNumber = getWeek(start, { weekStartsOn: 1 });

  return {
    startDate: formatDateToString(start),
    endDate: formatDateToString(end),
    year,
    weekNumber,
    label: `#${weekNumber}`,
  };
}

/**
 * 前週・次週の週範囲を取得
 * 指定された週の前後の週範囲を計算して返す
 */
export function getAdjacentWeeks(currentWeek: string): {
  previous: WeekRange;
  next: WeekRange;
} {
  if (!isValidDateString(currentWeek)) {
    throw new Error(`無効な日付文字列です: ${currentWeek}`);
  }

  const current = parseISO(currentWeek);

  // 前週（1週間前）
  const previousWeekDate = addWeeks(current, -1);
  const previousWeekStart = getStartOfWeek(previousWeekDate);

  // 次週（1週間後）
  const nextWeekDate = addWeeks(current, 1);
  const nextWeekStart = getStartOfWeek(nextWeekDate);

  return {
    previous: createWeekRange(previousWeekStart),
    next: createWeekRange(nextWeekStart),
  };
}

/**
 * 指定された週が未来の週かどうかを判定
 * 現在の週より後の週の場合にtrueを返す
 */
export function isFutureWeek(weekStartDate: string): boolean {
  if (!isValidDateString(weekStartDate)) {
    throw new Error(`無効な日付文字列です: ${weekStartDate}`);
  }

  const today = getCurrentJSTDate();
  const currentWeekStart = getStartOfWeek(today);
  const targetWeekStart = parseISO(weekStartDate);

  return isAfter(targetWeekStart, currentWeekStart);
}

/**
 * サイト別グループ化された週間レポートデータを生成
 * 指定された週の開始日に基づいてレポートデータを取得し、グループ化して返す
 */
export async function generateWeeklyReportGrouped({
  weekStartDate,
  db,
}: {
  weekStartDate: string;
  db: D1Database;
}): Promise<WeeklyReportGrouped> {
  if (!isValidDateString(weekStartDate)) {
    throw new Error(`無効な日付文字列です: ${weekStartDate}`);
  }

  const weekRange = createWeekRange(parseISO(weekStartDate));
  const [siteRankings, overallSummary] = await Promise.all([
    fetchWeeklyReportData({ weekRange, db }),
    fetchWeeklyOverallSummary({ db, weekStartDate: weekRange.startDate }),
  ]);

  return {
    weekRange,
    siteRankings,
    overallSummary,
  };
}

/**
 * JST基準で前週の週範囲を計算
 */
export function calculatePreviousWeek(jstDate: Date): WeekRange {
  const previousWeekDate = addWeeks(jstDate, -1);
  return createWeekRange(previousWeekDate);
}
