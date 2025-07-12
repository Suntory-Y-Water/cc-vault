/**
 * ウィークリーレポート関連のユーティリティ関数のテスト
 */

import { describe, it, expect, vi } from 'vitest';
import {
  getStartOfWeek,
  getEndOfWeek,
  createWeekRange,
  getAdjacentWeeks,
  isCurrentWeek,
  isFutureWeek,
  generateMockWeeklyArticles,
  generateWeeklyReport,
} from '@/lib/weekly-report';

describe('getStartOfWeek', () => {
  it('2025年7月12日（土）の場合、その週の月曜日を返す', () => {
    // Given: 2025年7月12日（土）
    const saturday = new Date('2025-07-12');

    // When: 週の開始日を取得
    const result = getStartOfWeek(saturday);

    // Then: その週の月曜日（7月7日）が返される
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(6);
    expect(result.getDate()).toBe(7);
  });

  it('2025年7月7日（月）の場合、同じ日を返す', () => {
    // Given: 2025年7月7日（月）
    const monday = new Date('2025-07-07');

    // When: 週の開始日を取得
    const result = getStartOfWeek(monday);

    // Then: 同じ日が返される
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(6);
    expect(result.getDate()).toBe(7);
  });

  it('2025年7月13日（日）の場合、その週の月曜日を返す', () => {
    // Given: 2025年7月13日（日）
    const sunday = new Date('2025-07-13');

    // When: 週の開始日を取得
    const result = getStartOfWeek(sunday);

    // Then: その週の月曜日（7月7日）が返される
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(6);
    expect(result.getDate()).toBe(7);
  });
});

describe('getEndOfWeek', () => {
  it('2025年7月7日（月）の場合、その週の日曜日を返す', () => {
    // Given: 2025年7月7日（月）
    const monday = new Date('2025-07-07');

    // When: 週の終了日を取得
    const result = getEndOfWeek(monday);

    // Then: その週の日曜日（7月13日）が返される
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(6);
    expect(result.getDate()).toBe(13);
  });

  it('2025年7月12日（土）の場合、その週の日曜日を返す', () => {
    // Given: 2025年7月12日（土）
    const saturday = new Date('2025-07-12');

    // When: 週の終了日を取得
    const result = getEndOfWeek(saturday);

    // Then: その週の日曜日（7月13日）が返される
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(6);
    expect(result.getDate()).toBe(13);
  });

  it('2025年7月13日（日）の場合、同じ日を返す', () => {
    // Given: 2025年7月13日（日）
    const sunday = new Date('2025-07-13');

    // When: 週の終了日を取得
    const result = getEndOfWeek(sunday);

    // Then: 同じ日が返される
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(6);
    expect(result.getDate()).toBe(13);
  });
});

describe('createWeekRange', () => {
  it('2025年7月12日を指定した場合、正しい週範囲を返す', () => {
    // Given: 2025年7月12日（土）
    const saturday = new Date('2025-07-12');

    // When: 週範囲を作成
    const result = createWeekRange(saturday);

    // Then: 正しい週範囲が返される
    expect(result).toEqual({
      startDate: '2025-07-07',
      endDate: '2025-07-13',
      year: 2025,
      weekNumber: 28,
      label: '#28',
    });
  });

  it('年始の週を含む場合、正しい週番号を返す', () => {
    // Given: 2025年1月6日（月）
    const newYear = new Date('2025-01-06');

    // When: 週範囲を作成
    const result = createWeekRange(newYear);

    // Then: 正しい週番号が返される
    expect(result.weekNumber).toBe(2);
    expect(result.year).toBe(2025);
  });

  it('年末の週を含む場合、正しい週番号を返す', () => {
    // Given: 2025年12月22日（月）
    const yearEnd = new Date('2025-12-22');

    // When: 週範囲を作成
    const result = createWeekRange(yearEnd);

    // Then: 正しい週番号が返される
    expect(result.year).toBe(2025);
    expect(result.weekNumber).toBeGreaterThan(50);
  });
});

describe('getAdjacentWeeks', () => {
  it('2025年7月7日を基準として前週と次週を返す', () => {
    // Given: 2025年7月7日（月）
    const currentWeek = '2025-07-07';

    // When: 隣接する週を取得
    const result = getAdjacentWeeks(currentWeek);

    // Then: 前週と次週が正しく返される
    expect(result.previous.startDate).toBe('2025-06-30');
    expect(result.previous.endDate).toBe('2025-07-06');
    expect(result.next.startDate).toBe('2025-07-14');
    expect(result.next.endDate).toBe('2025-07-20');
  });

  it('月をまたぐ場合でも正しく隣接する週を返す', () => {
    // Given: 2025年7月28日（月）
    const currentWeek = '2025-07-28';

    // When: 隣接する週を取得
    const result = getAdjacentWeeks(currentWeek);

    // Then: 月をまたいだ週が正しく返される
    expect(result.previous.startDate).toBe('2025-07-21');
    expect(result.next.startDate).toBe('2025-08-04');
  });

  it('年をまたぐ場合でも正しく隣接する週を返す', () => {
    // Given: 2024年12月30日（月）
    const currentWeek = '2024-12-30';

    // When: 隣接する週を取得
    const result = getAdjacentWeeks(currentWeek);

    // Then: 年をまたいだ週が正しく返される
    expect(result.previous.startDate).toBe('2024-12-23');
    expect(result.next.startDate).toBe('2025-01-06');
  });
});

describe('isCurrentWeek', () => {
  it('今日を含む週の開始日を指定した場合、trueを返す', () => {
    // Given: 今日の日付をモック
    const today = new Date('2025-07-12');
    vi.setSystemTime(today);

    // When: 今日を含む週の開始日で判定
    const result = isCurrentWeek('2025-07-07');

    // Then: trueが返される
    expect(result).toBe(true);
  });

  it('今日を含まない週の開始日を指定した場合、falseを返す', () => {
    // Given: 今日の日付をモック
    const today = new Date('2025-07-12');
    vi.setSystemTime(today);

    // When: 今日を含まない週の開始日で判定
    const result = isCurrentWeek('2025-06-30');

    // Then: falseが返される
    expect(result).toBe(false);
  });

  it('未来の週の開始日を指定した場合、falseを返す', () => {
    // Given: 今日の日付をモック
    const today = new Date('2025-07-12');
    vi.setSystemTime(today);

    // When: 未来の週の開始日で判定
    const result = isCurrentWeek('2025-07-14');

    // Then: falseが返される
    expect(result).toBe(false);
  });
});

describe('isFutureWeek', () => {
  it('未来の週の開始日を指定した場合、trueを返す', () => {
    // Given: 今日の日付をモック
    const today = new Date('2025-07-12');
    vi.setSystemTime(today);

    // When: 未来の週の開始日で判定
    const result = isFutureWeek('2025-07-14');

    // Then: trueが返される
    expect(result).toBe(true);
  });

  it('今日を含む週の開始日を指定した場合、falseを返す', () => {
    // Given: 今日の日付をモック
    const today = new Date('2025-07-12');
    vi.setSystemTime(today);

    // When: 今日を含む週の開始日で判定
    const result = isFutureWeek('2025-07-07');

    // Then: falseが返される
    expect(result).toBe(false);
  });

  it('過去の週の開始日を指定した場合、falseを返す', () => {
    // Given: 今日の日付をモック
    const today = new Date('2025-07-12');
    vi.setSystemTime(today);

    // When: 過去の週の開始日で判定
    const result = isFutureWeek('2025-06-30');

    // Then: falseが返される
    expect(result).toBe(false);
  });
});

describe('generateMockWeeklyArticles', () => {
  it('指定された週範囲に対してモック記事の配列を返す', () => {
    // Given: 週範囲
    const weekRange = {
      startDate: '2025-07-07',
      endDate: '2025-07-13',
      year: 2025,
      weekNumber: 28,
      label: '#28',
    };

    // When: モック記事を生成
    const result = generateMockWeeklyArticles(weekRange);

    // Then: 記事の配列が返される
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('生成される記事が正しい構造を持つ', () => {
    // Given: 週範囲
    const weekRange = {
      startDate: '2025-07-07',
      endDate: '2025-07-13',
      year: 2025,
      weekNumber: 28,
      label: '#28',
    };

    // When: モック記事を生成
    const result = generateMockWeeklyArticles(weekRange);

    // Then: 記事が正しい構造を持つ
    const firstArticle = result[0];
    expect(firstArticle).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      url: expect.any(String),
      author: expect.any(String),
      publishedAt: expect.any(String),
      site: expect.any(String),
      engagement: {
        likes: expect.any(Number),
        bookmarks: expect.any(Number),
      },
      weeklyRank: expect.any(Number),
    });
  });

  it('生成される記事のランキングが正しく設定される', () => {
    // Given: 週範囲
    const weekRange = {
      startDate: '2025-07-07',
      endDate: '2025-07-13',
      year: 2025,
      weekNumber: 28,
      label: '#28',
    };

    // When: モック記事を生成
    const result = generateMockWeeklyArticles(weekRange);

    // Then: ランキングが正しく設定される
    expect(result[0].weeklyRank).toBe(1);
    expect(result[1].weeklyRank).toBe(2);
  });
});

describe('generateWeeklyReport', () => {
  it('指定された週の開始日からレポートを生成する', () => {
    // Given: 週の開始日
    const weekStartDate = '2025-07-07';

    // When: 週間レポートを生成
    const result = generateWeeklyReport(weekStartDate);

    // Then: 正しいレポートが生成される
    expect(result).toMatchObject({
      weekRange: {
        startDate: '2025-07-07',
        endDate: '2025-07-13',
        year: 2025,
        weekNumber: 28,
        label: '#28',
      },
      topArticles: expect.any(Array),
    });
  });

  it('生成されるレポートの記事リストが空でない', () => {
    // Given: 週の開始日
    const weekStartDate = '2025-07-07';

    // When: 週間レポートを生成
    const result = generateWeeklyReport(weekStartDate);

    // Then: 記事リストが空でない
    expect(result.topArticles.length).toBeGreaterThan(0);
  });

  it('有効な日付文字列でエラーが発生しない', () => {
    // Given: 有効な日付文字列
    const weekStartDate = '2025-07-07';

    // When: 週間レポートを生成
    const result = generateWeeklyReport(weekStartDate);

    // Then: エラーが発生せず、結果が返される
    expect(result).toBeDefined();
    expect(result.weekRange).toBeDefined();
    expect(result.topArticles).toBeDefined();
  });
});
