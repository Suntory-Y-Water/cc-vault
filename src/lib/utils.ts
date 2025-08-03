import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, toZonedTime } from 'date-fns-tz';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 日時文字列をJSTのISO文字列に変換する
 * @param dateString - 変換する日時文字列
 * @returns JST形式のISO文字列
 */
export function convertToJstString(dateString: string): string {
  const timeZone = 'Asia/Tokyo';
  const zonedDate = toZonedTime(new Date(dateString), timeZone);
  return format(zonedDate, "yyyy-MM-dd'T'HH:mm:ss", { timeZone });
}

/**
 * URLがZennまたはQiitaのドメインかどうかを判定する
 * @param url - 判定対象のURL
 * @returns ZennまたはQiitaのURLの場合true
 */
export function isZennOrQiitaUrl(url: string): boolean {
  return url.includes('zenn.dev') || url.includes('qiita.com');
}

/**
 * 文字列を正規化する（改行・タブの削除、全角文字の変換など）
 * @param text - 正規化する文字列
 * @returns 正規化された文字列
 */
export function normalizeText(text: string): string {
  return text
    .normalize('NFKC') // Unicode正規化（全角英数字→半角）
    .replace(/\r\n|\r|\n/g, ' ') // 改行コードを削除
    .replace(/\t/g, '') // タブを削除
    .trim(); // 前後の空白を削除
}

/**
 * URLからドメインを取得する
 */
export function getDomainFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    throw new Error(`URLのドメイン取得に失敗しました: ${error}`);
  }
}
