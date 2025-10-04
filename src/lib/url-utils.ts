import { SiteType, SortOrder } from '@/types/article';

/**
 * クエリパラメータからURLを生成する
 * @param params - URLパラメータ設定
 * @returns URL文字列
 */
export function createQueryUrl({
  site,
  order,
  query,
}: {
  site?: SiteType;
  order?: SortOrder;
  query?: string;
}): string {
  const params = new URLSearchParams();

  // 検索クエリがある場合は検索ページ、ない場合はホームページ
  const basePath = query ? '/search' : '/';

  if (query) {
    params.set('q', query);
  }

  if (site && site !== 'all') {
    params.set('site', site);
  }

  if (order && order !== 'latest') {
    params.set('order', order);
  }

  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}
