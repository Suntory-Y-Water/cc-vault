/**
 * Zod Branded Typeスキーマ定義
 */

import { z } from 'zod';
import { SITE_NAMES, SORT_ORDERS } from './article';

/**
 * ページ番号の事前条件・事後条件を定義するBranded Typeスキーマ
 * 1以上の正整数であることを保証し、不正値は1にフォールバック
 */
export const ValidPageNumberSchema = z
  .number()
  .int()
  .min(1, 'ページ番号は1以上である必要があります')
  .brand<'ValidPageNumber'>();

export type ValidPageNumber = z.infer<typeof ValidPageNumberSchema>;

/**
 * サイトタイプの事前条件・事後条件を定義するBranded Typeスキーマ
 * SITE_NAMES定数の有効なキーであることを保証し、不正値は'all'にフォールバック
 */
export const ValidSiteTypeSchema = z
  .enum(
    Object.keys(SITE_NAMES) as [
      keyof typeof SITE_NAMES,
      ...Array<keyof typeof SITE_NAMES>,
    ],
  )
  .brand<'ValidSiteType'>();

export type ValidSiteType = z.infer<typeof ValidSiteTypeSchema>;

/**
 * ソート順の事前条件・事後条件を定義するBranded Typeスキーマ
 * SORT_ORDERS定数の有効なキーであることを保証し、不正値は'latest'にフォールバック
 */
export const ValidSortOrderSchema = z
  .enum(
    Object.keys(SORT_ORDERS) as [
      keyof typeof SORT_ORDERS,
      ...Array<keyof typeof SORT_ORDERS>,
    ],
  )
  .brand<'ValidSortOrder'>();

export type ValidSortOrder = z.infer<typeof ValidSortOrderSchema>;

/**
 * クエリパラメータの検証結果を表現するBranded Typeスキーマ
 */
export const ValidatedQueryParamsSchema = z
  .object({
    page: ValidPageNumberSchema,
    site: ValidSiteTypeSchema,
    order: ValidSortOrderSchema,
  })
  .brand<'ValidatedQueryParams'>();

export type ValidatedQueryParams = z.infer<typeof ValidatedQueryParamsSchema>;
