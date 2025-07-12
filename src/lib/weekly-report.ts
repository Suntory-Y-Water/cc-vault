/**
 * ウィークリーレポート関連のユーティリティ関数
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
import type { WeekRange, WeeklyArticle, WeeklyReport } from '@/types';

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
 * 記事データから週間記事データを生成（モック）
 */
export function generateMockWeeklyArticles(
  weekRange: WeekRange,
): WeeklyArticle[] {
  // 実際の実装では外部APIからデータを取得
  // ここではモックデータを返す（2025-06-30～2025-07-06とその前の週のみ）

  // 2025-06-30から2025-07-06の週（月曜日始まり）
  if (weekRange.startDate === '2025-06-30') {
    return [
      {
        id: '1',
        title: 'Next.js 15の新機能について',
        url: 'https://zenn.dev/example/1',
        author: 'developer1',
        publishedAt: '2025-07-06',
        site: 'zenn',
        engagement: {
          likes: 150,
          bookmarks: 80,
        },
        weeklyRank: 1,
      },
      {
        id: '2',
        title: 'TypeScriptでより良いコードを書く方法',
        url: 'https://qiita.com/example/2',
        author: 'developer2',
        publishedAt: '2025-07-05',
        site: 'qiita',
        engagement: {
          likes: 120,
          bookmarks: 65,
        },
        weeklyRank: 2,
      },
      {
        id: '3',
        title: 'React 19の新機能まとめ',
        url: 'https://zenn.dev/example/3',
        author: 'developer3',
        publishedAt: '2025-07-01',
        site: 'zenn',
        engagement: {
          likes: 100,
          bookmarks: 55,
        },
        weeklyRank: 3,
      },
      {
        id: '4',
        title: 'Vue 3.5の新機能紹介',
        url: 'https://qiita.com/example/4',
        author: 'developer4',
        publishedAt: '2025-06-30',
        site: 'qiita',
        engagement: {
          likes: 90,
          bookmarks: 45,
        },
        weeklyRank: 4,
      },
    ];
  }

  // 2025-06-23から2025-06-29の週（前の週）
  if (weekRange.startDate === '2025-06-23') {
    return [
      {
        id: '5',
        title: 'Nuxt 3の新機能紹介',
        url: 'https://zenn.dev/example/5',
        author: 'developer5',
        publishedAt: '2025-06-29',
        site: 'zenn',
        engagement: {
          likes: 110,
          bookmarks: 60,
        },
        weeklyRank: 1,
      },
      {
        id: '6',
        title: 'Tailwind CSS 4.0の新機能',
        url: 'https://qiita.com/example/6',
        author: 'developer6',
        publishedAt: '2025-06-27',
        site: 'qiita',
        engagement: {
          likes: 85,
          bookmarks: 40,
        },
        weeklyRank: 2,
      },
      {
        id: '7',
        title: 'Vite 6.0の新機能まとめ',
        url: 'https://zenn.dev/example/7',
        author: 'developer7',
        publishedAt: '2025-06-25',
        site: 'zenn',
        engagement: {
          likes: 75,
          bookmarks: 35,
        },
        weeklyRank: 3,
      },
      {
        id: '8',
        title: 'Pinia vs Vuex比較',
        url: 'https://qiita.com/example/8',
        author: 'developer8',
        publishedAt: '2025-06-23',
        site: 'qiita',
        engagement: {
          likes: 65,
          bookmarks: 30,
        },
        weeklyRank: 4,
      },
    ];
  }

  // その他の週の場合は空の配列を返す
  return [];
}

/**
 * 週間レポートデータを生成
 */
export function generateWeeklyReport(weekStartDate: string): WeeklyReport {
  const weekRange = createWeekRange(new Date(weekStartDate));
  const topArticles = generateMockWeeklyArticles(weekRange);

  return {
    weekRange,
    topArticles,
  };
}
