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
