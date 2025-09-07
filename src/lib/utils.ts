import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, toZonedTime } from 'date-fns-tz';
import {
  ValidPageNumberSchema,
  ValidSiteTypeSchema,
  ValidSortOrderSchema,
  ValidatedQueryParamsSchema,
  type ValidatedQueryParams,
} from '@/types';

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

/**
 * クエリパラメータをZod Branded Typeスキーマで検証し、型安全な値を返す
 * 契約による設計：不正な値が来ても例外を投げず、無害なデフォルト値にフォールバックする
 * @param params - 生のクエリパラメータ
 * @returns ValidatedQueryParams型（Branded Type）の検証済みクエリパラメータ
 */
export function validateQueryParams(params: {
  page?: string | string[];
  site?: string | string[];
  order?: string | string[];
}): ValidatedQueryParams {
  // 配列の場合は最初の値を使用、undefinedの場合はデフォルト値を使用
  const pageValue = Array.isArray(params.page) ? params.page[0] : params.page;
  const siteValue = Array.isArray(params.site) ? params.site[0] : params.site;
  const orderValue = Array.isArray(params.order)
    ? params.order[0]
    : params.order;

  // 事前条件チェック（例外を投げずデフォルト値にフォールバック）
  const safePageResult = ValidPageNumberSchema.safeParse(
    Number(pageValue) || 1,
  );
  const validPage = safePageResult.success
    ? safePageResult.data
    : ValidPageNumberSchema.parse(1);

  const safeSiteResult = ValidSiteTypeSchema.safeParse(siteValue);
  const validSite = safeSiteResult.success
    ? safeSiteResult.data
    : ValidSiteTypeSchema.parse('all');

  const safeOrderResult = ValidSortOrderSchema.safeParse(orderValue);
  const validOrder = safeOrderResult.success
    ? safeOrderResult.data
    : ValidSortOrderSchema.parse('latest');

  // 事後条件チェック：Branded Type付きオブジェクトの検証・生成
  return ValidatedQueryParamsSchema.parse({
    page: validPage,
    site: validSite,
    order: validOrder,
  });
}
