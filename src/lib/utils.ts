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
    .replace(/\s+/g, ' ') // 連続する半角スペースを1個に統一
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

/**
 * Note記事のURLをNote API URLに変換する
 * @param articleUrl - Note記事のURL (例: https://note.com/suthio/n/n45a179642d7d)
 * @returns Note API URL (例: https://note.com/api/v3/notes/n45a179642d7d)
 */
export function convertNoteUrlToApiUrl(articleUrl: string): string {
  try {
    const urlObj = new URL(articleUrl);

    // URLパスから記事IDを抽出 (例: /suthio/n/n45a179642d7d -> n45a179642d7d)
    const pathMatch = urlObj.pathname.match(/\/[^/]+\/n\/([^/]+)/);
    if (!pathMatch || !pathMatch[1]) {
      throw new Error('Note記事のURL形式が正しくありません');
    }

    const noteId = pathMatch[1];
    return `https://note.com/api/v3/notes/${noteId}`;
  } catch (error) {
    throw new Error(`Note URL変換に失敗しました: ${error}`);
  }
}

/**
 * Qiita記事のURLをQiita API URLに変換する
 * @param articleUrl - Qiita記事のURL (例: https://qiita.com/godhexagon/items/5ad55f1a7723ec095429)
 * @returns Qiita API URL (例: https://qiita.com/api/v2/items/5ad55f1a7723ec095429)
 */
export function convertQiitaUrlToApiUrl(articleUrl: string): string {
  try {
    const urlObj = new URL(articleUrl);

    // URLパスから記事IDを抽出 (例: /godhexagon/items/5ad55f1a7723ec095429 -> 5ad55f1a7723ec095429)
    const pathMatch = urlObj.pathname.match(/\/[^/]+\/items\/([^/]+)/);
    if (!pathMatch || !pathMatch[1]) {
      throw new Error('Qiita記事のURL形式が正しくありません');
    }

    const itemId = pathMatch[1];
    return `https://qiita.com/api/v2/items/${itemId}`;
  } catch (error) {
    throw new Error(`Qiita URL変換に失敗しました: ${error}`);
  }
}
