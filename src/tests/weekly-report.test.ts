/**
 * weekly-report.ts の契約による設計に基づくテストケース
 * 各関数の事前条件、事後条件、不変条件を検証
 * Given-When-Thenパターンで実装
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getCurrentJSTDate,
  getStartOfWeek,
  getEndOfWeek,
  formatDateToString,
  isValidDateString,
  calculatePreviousWeek,
  isFutureWeek,
  generateWeeklyReportGrouped,
} from '../lib/weekly-report';
import { TZDate } from '@date-fns/tz';

// テスト用固定値
const TEST_CONSTANTS = {
  // 2025年8月9日 (土曜日) をテスト基準日として使用
  TEST_DATE_STRING: '2025-08-09',
  JST_TIMESTAMP: '2025-08-09T09:54:40+09:00',
  EXPECTED_HOURS: 9,
  EXPECTED_MINUTES: 54,
  EXPECTED_SECONDS: 40,
  // この週の範囲（月曜日始まり）
  CURRENT_WEEK_START: '2025-08-04', // 月曜日
  CURRENT_WEEK_END: '2025-08-10', // 日曜日
  PREVIOUS_WEEK_START: '2025-07-28', // 前週月曜日
  PREVIOUS_WEEK_END: '2025-08-03', // 前週日曜日
} as const;

describe('週次レポート関数のテスト', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getCurrentJSTDate関数', () => {
    it('Given システム時刻が設定されている When getCurrentJSTDate()を実行 Then 正確なJSTのTZDateオブジェクトを返すこと', () => {
      // Given
      const mockJSTTime = new Date(TEST_CONSTANTS.JST_TIMESTAMP);
      vi.setSystemTime(mockJSTTime);

      // When
      const result = getCurrentJSTDate();

      // Then - 事後条件
      expect(result).toBeInstanceOf(TZDate);
      expect(result.timeZone).toBe('Asia/Tokyo');
      expect(result.getHours()).toBe(TEST_CONSTANTS.EXPECTED_HOURS);
      expect(result.getMinutes()).toBe(TEST_CONSTANTS.EXPECTED_MINUTES);
      expect(result.getSeconds()).toBe(TEST_CONSTANTS.EXPECTED_SECONDS);
    });

    it('Given 任意の時刻 When getCurrentJSTDate()を実行 Then 必ずJSTタイムゾーンを返すこと', () => {
      // Given
      const differentTime = new Date('2025-01-01T12:00:00+09:00');
      vi.setSystemTime(differentTime);

      // When
      const result = getCurrentJSTDate();

      // Then - 不変条件
      expect(result.timeZone).toBe('Asia/Tokyo');
      expect(result).toBeInstanceOf(TZDate);
    });
  });

  describe('formatDateToString関数', () => {
    it('Given 無効なDateオブジェクト When formatDateToString()を実行 Then RangeErrorが発生すること（date-fnsの実際の動作）', () => {
      // Given
      const invalidDate = new Date('invalid');

      // When & Then - date-fnsは無効な日付に対してRangeErrorをスローする
      expect(() => formatDateToString(invalidDate)).toThrow(RangeError);
    });

    it('Given 有効な日付 When formatDateToString()を実行 Then yyyy-MM-dd形式の文字列を返すこと', () => {
      // Given
      const testDate = new Date(`${TEST_CONSTANTS.TEST_DATE_STRING}T10:30:45`);

      // When
      const result = formatDateToString(testDate);

      // Then - 事後条件
      expect(result).toBe(TEST_CONSTANTS.TEST_DATE_STRING);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('Given 月日が一桁の日付 When formatDateToString()を実行 Then ゼロパディングされた文字列を返すこと', () => {
      // Given
      const testDate = new Date('2025-01-05T10:30:45');

      // When
      const result = formatDateToString(testDate);

      // Then - 事後条件
      expect(result).toBe('2025-01-05');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('isValidDateString関数', () => {
    it('Given null When isValidDateString()を実行 Then 不正な値としてfalseを返すこと', () => {
      // Given & When & Then - 不正な値が入力された場合はfalseを返す
      const result = isValidDateString(null as any);
      expect(result).toBe(false);
    });

    it('Given undefined When isValidDateString()を実行 Then 不正な値としてfalseを返すこと', () => {
      // Given & When & Then - 不正な値が入力された場合はfalseを返す
      const result = isValidDateString(undefined as any);
      expect(result).toBe(false);
    });

    it('Given 正しい日付形式 When isValidDateString()を実行 Then trueを返すこと', () => {
      // Given
      const validDateString = TEST_CONSTANTS.TEST_DATE_STRING;

      // When
      const result = isValidDateString(validDateString);

      // Then - 事後条件
      expect(result).toBe(true);
    });

    it('Given 不正な形式 When isValidDateString()を実行 Then falseを返すこと', () => {
      // Given
      const invalidFormats = [
        '2025/08/09',
        '2025-8-9',
        '25-08-09',
        '2025-13-01',
        '2025-02-30',
        'invalid-date',
        '',
      ];

      for (const invalidFormat of invalidFormats) {
        // When
        const result = isValidDateString(invalidFormat);

        // Then - 事後条件
        expect(result).toBe(false);
      }
    });
  });

  describe('getStartOfWeek関数', () => {
    it('Given 土曜日の日付 When getStartOfWeek()を実行 Then その週の月曜日を返すこと', () => {
      // Given
      const saturdayDate = new Date('2025-08-09T10:30:00'); // 土曜日

      // When
      const result = getStartOfWeek(saturdayDate);

      // Then - 事後条件
      expect(formatDateToString(result)).toBe(
        TEST_CONSTANTS.CURRENT_WEEK_START,
      );
      expect(result.getDay()).toBe(1); // 月曜日は1
    });

    it('Given 月曜日の日付 When getStartOfWeek()を実行 Then 同じ日付を返すこと', () => {
      // Given
      const mondayDate = new Date('2025-08-05T10:30:00'); // 月曜日

      // When
      const result = getStartOfWeek(mondayDate);

      // Then - 事後条件
      expect(formatDateToString(result)).toBe(
        TEST_CONSTANTS.CURRENT_WEEK_START,
      );
      expect(result.getDay()).toBe(1); // 月曜日は1
    });

    it('Given 任意の日付 When getStartOfWeek()を実行 Then 常に月曜日を返すこと', () => {
      // Given
      const testDates = [
        new Date('2025-08-04'), // 月曜日
        new Date('2025-08-05'), // 火曜日
        new Date('2025-08-06'), // 水曜日
        new Date('2025-08-07'), // 木曜日
        new Date('2025-08-08'), // 金曜日
        new Date('2025-08-09'), // 土曜日
        new Date('2025-08-10'), // 日曜日
      ];

      for (const testDate of testDates) {
        // When
        const result = getStartOfWeek(testDate);

        // Then - 不変条件
        expect(result.getDay()).toBe(1); // 常に月曜日
      }
    });
  });

  describe('getEndOfWeek関数', () => {
    it('Given 土曜日の日付 When getEndOfWeek()を実行 Then その週の日曜日を返すこと', () => {
      // Given
      const saturdayDate = new Date('2025-08-09T10:30:00'); // 土曜日

      // When
      const result = getEndOfWeek(saturdayDate);

      // Then - 事後条件
      expect(formatDateToString(result)).toBe(TEST_CONSTANTS.CURRENT_WEEK_END);
      expect(result.getDay()).toBe(0); // 日曜日は0
    });

    it('Given 任意の日付 When getEndOfWeek()を実行 Then 常に日曜日を返すこと', () => {
      // Given
      const testDates = [
        new Date('2025-08-04'), // 月曜日
        new Date('2025-08-05'), // 火曜日
        new Date('2025-08-06'), // 水曜日
        new Date('2025-08-07'), // 木曜日
        new Date('2025-08-08'), // 金曜日
        new Date('2025-08-09'), // 土曜日
        new Date('2025-08-10'), // 日曜日
      ];

      for (const testDate of testDates) {
        // When
        const result = getEndOfWeek(testDate);

        // Then - 不変条件
        expect(result.getDay()).toBe(0); // 常に日曜日
      }
    });
  });

  describe('calculatePreviousWeek関数', () => {
    it('Given 現在日付 When calculatePreviousWeek()を実行 Then 前週のWeekRangeを返すこと', () => {
      // Given
      const currentDate = new Date('2025-08-09T10:30:00'); // 土曜日

      // When
      const result = calculatePreviousWeek(currentDate);

      // Then - 事後条件
      expect(result.startDate).toBe(TEST_CONSTANTS.PREVIOUS_WEEK_START);
      expect(result.endDate).toBe(TEST_CONSTANTS.PREVIOUS_WEEK_END);
      expect(result.year).toBeGreaterThan(2020);
      expect(result.year).toBeLessThan(2100);
      expect(result.weekNumber).toBeGreaterThan(0);
      expect(result.weekNumber).toBeLessThanOrEqual(53);
      expect(result.label).toMatch(/^#\d+$/);
    });
  });

  it('Given 任意の日付 When calculatePreviousWeek()を実行 Then 7日間の範囲を持つWeekRangeを返すこと', () => {
    // Given
    const testDate = new Date('2025-08-09T10:30:00');

    // When
    const result = calculatePreviousWeek(testDate);
    const startDate = new Date(result.startDate);
    const endDate = new Date(result.endDate);
    const daysDiff =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

    // Then - 不変条件
    expect(daysDiff).toBe(6); // 月曜〜日曜の6日差
  });

  describe('isFutureWeek関数', () => {
    it('Given 無効な日付文字列 When isFutureWeek()を実行 Then エラーをスローすること', () => {
      // Given
      const invalidDateString = 'invalid-date';

      // When & Then - 事前条件違反
      expect(() => isFutureWeek(invalidDateString)).toThrow();
    });

    it('Given 過去の週開始日 When isFutureWeek()を実行 Then falseを返すこと', () => {
      // Given
      const mockCurrentTime = new Date('2025-08-09T10:30:00'); // 土曜日
      vi.setSystemTime(mockCurrentTime);
      const pastWeekStart = '2025-07-28'; // 前週月曜日

      // When
      const result = isFutureWeek(pastWeekStart);

      // Then - 事後条件
      expect(result).toBe(false);
    });

    it('Given 未来の週開始日 When isFutureWeek()を実行 Then trueを返すこと', () => {
      // Given
      const mockCurrentTime = new Date('2025-08-09T10:30:00'); // 土曜日
      vi.setSystemTime(mockCurrentTime);
      const futureWeekStart = '2025-08-11'; // 来週月曜日

      // When
      const result = isFutureWeek(futureWeekStart);

      // Then - 事後条件
      expect(result).toBe(true);
    });

    // TODO:テストの期待値を要確認
    it.skip('Given 現在の週開始日 When isFutureWeek()を実行 Then falseを返すこと', () => {
      // Given
      const mockCurrentTime = new Date('2025-08-09T10:30:00'); // 土曜日
      vi.setSystemTime(mockCurrentTime);
      const currentWeekStart = TEST_CONSTANTS.CURRENT_WEEK_START; // 今週月曜日

      // When
      const result = isFutureWeek(currentWeekStart);

      // Then - 事後条件
      expect(result).toBe(false);
    });
  });

  describe('統合テスト', () => {
    it('Given 日付 When getStartOfWeek→formatDateToString→isValidDateString の流れで実行 Then 一貫した結果を得ること', () => {
      // Given
      const testDate = new Date(`${TEST_CONSTANTS.TEST_DATE_STRING}T10:30:00`);

      // When
      const startOfWeek = getStartOfWeek(testDate);
      const formatted = formatDateToString(startOfWeek);
      const isValid = isValidDateString(formatted);

      // Then - 統合不変条件
      expect(isValid).toBe(true);
      expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('Given 現在日付 When calculatePreviousWeek→各日付のバリデーション の流れで実行 Then 全て有効な日付文字列であること', () => {
      // Given
      const mockCurrentTime = new Date(
        `${TEST_CONSTANTS.TEST_DATE_STRING}T10:30:00`,
      );
      vi.setSystemTime(mockCurrentTime);

      // When
      const previousWeek = calculatePreviousWeek(mockCurrentTime);

      // Then - 統合不変条件
      expect(isValidDateString(previousWeek.startDate)).toBe(true);
      expect(isValidDateString(previousWeek.endDate)).toBe(true);
      expect(previousWeek.year).toBeGreaterThan(2020);
      expect(previousWeek.year).toBeLessThan(2100);
      expect(previousWeek.weekNumber).toBeGreaterThan(0);
      expect(previousWeek.weekNumber).toBeLessThanOrEqual(53);
    });
  });

  describe('generateWeeklyReportGrouped関数のAIエージェント対応', () => {
    const mockDB = {} as D1Database;

    it('Given 有効な週開始日とAIエージェント When generateWeeklyReportGrouped()を実行 Then AIエージェント別の週次レポートを返すこと', async () => {
      // Given
      const weekStartDate = TEST_CONSTANTS.CURRENT_WEEK_START;
      const aiAgent = 'claude-code';

      // When - aiAgentパラメータを受け取ることをテスト
      const result = await generateWeeklyReportGrouped({
        weekStartDate,
        db: mockDB,
        aiAgent,
      });

      // Then - 基本的な構造とパラメータの受け取りを確認
      expect(result).toHaveProperty('weekRange');
      expect(result).toHaveProperty('siteRankings');
      expect(result).toHaveProperty('overallSummary');
      expect(result.weekRange.startDate).toBe(weekStartDate);
    });

    it('Given デフォルトAIエージェント When generateWeeklyReportGrouped()を実行 Then 関数が正常に実行されること', async () => {
      // Given
      const weekStartDate = TEST_CONSTANTS.CURRENT_WEEK_START;
      const aiAgent = 'default';

      // When
      const result = await generateWeeklyReportGrouped({
        weekStartDate,
        db: mockDB,
        aiAgent,
      });

      // Then - 基本的な構造の確認
      expect(result).toHaveProperty('weekRange');
      expect(result).toHaveProperty('siteRankings');
      expect(result).toHaveProperty('overallSummary');
      expect(result.weekRange.startDate).toBe(weekStartDate);
    });

    it('Given AIエージェントなし When generateWeeklyReportGrouped()を実行 Then デフォルト動作で実行されること', async () => {
      // Given
      const weekStartDate = TEST_CONSTANTS.CURRENT_WEEK_START;

      // When - aiAgentパラメータなしで実行
      const result = await generateWeeklyReportGrouped({
        weekStartDate,
        db: mockDB,
      });

      // Then - 基本的な構造の確認
      expect(result).toHaveProperty('weekRange');
      expect(result).toHaveProperty('siteRankings');
      expect(result).toHaveProperty('overallSummary');
      expect(result.weekRange.startDate).toBe(weekStartDate);
    });
  });
});
