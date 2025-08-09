/**
 * weekly-report.ts のテストケース
 * JST時刻の正しい実装を検証
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getCurrentJSTDate } from '../lib/weekly-report';
import { TZDate } from '@date-fns/tz';

// テスト用固定値
const TEST_CONSTANTS = {
  // 2025年8月9日 9:54:40 JST のタイムスタンプ
  JST_TIMESTAMP: '2025-08-09T09:54:40+09:00',
  UTC_TIMESTAMP: '2025-08-09T00:54:40.000Z',
  EXPECTED_HOURS: 9,
  EXPECTED_MINUTES: 54,
  EXPECTED_SECONDS: 40,
  EXPECTED_DATE: '2025-08-09',
} as const;

describe('JST時刻変換テスト', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getCurrentJSTDate - シンプルテスト', () => {
    it('JST時刻のDateオブジェクトを返すこと', () => {
      // テスト用の固定時刻を設定
      const mockJSTTime = new Date(TEST_CONSTANTS.JST_TIMESTAMP);
      vi.setSystemTime(mockJSTTime);

      const result = getCurrentJSTDate();

      console.log(
        'Expected JST time:',
        TEST_CONSTANTS.EXPECTED_HOURS,
        TEST_CONSTANTS.EXPECTED_MINUTES,
        TEST_CONSTANTS.EXPECTED_SECONDS,
      );
      console.log('Actual result:', result);
      console.log('Result type:', result.constructor.name);
      console.log('Result timeZone:', result.timeZone);
      console.log('Result hours:', result.getHours());
      console.log('Result minutes:', result.getMinutes());
      console.log('Result seconds:', result.getSeconds());
      console.log('Result ISO:', result.toISOString());

      // TZDateの特性を検証
      expect(result).toBeInstanceOf(TZDate);
      expect(result.timeZone).toBe('Asia/Tokyo');
      
      // 時刻の検証
      expect(result.getHours()).toBe(TEST_CONSTANTS.EXPECTED_HOURS);
      expect(result.getMinutes()).toBe(TEST_CONSTANTS.EXPECTED_MINUTES);
      expect(result.getSeconds()).toBe(TEST_CONSTANTS.EXPECTED_SECONDS);
    });
  });
});
