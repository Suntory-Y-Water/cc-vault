import ArticleContainer from '@/components/article/ArticleContainer';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getArticlesWithPagination } from '@/lib/cloudflare';
import { SiteType, SortOrder, SITE_NAMES, SORT_ORDERS } from '@/types';

/** 1時間で再検証 */
export const revalidate = 3600;

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * ホームページコンポーネント
 * データ取得をサーバーサイドで実行し、結果をClient Componentに渡す
 */
export default async function HomePage({ searchParams }: Props) {
  const { env } = await getCloudflareContext({ async: true });

  const searchParamsObj = await searchParams;

  // シンプルな型ガードを使用
  const getValue = (key: string): string | undefined => {
    const value = searchParamsObj[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const page = Number(getValue('page')) || 1;
  const siteParam = getValue('site');
  const orderParam = getValue('order');

  // シンプルな型チェック
  const site =
    siteParam && Object.keys(SITE_NAMES).includes(siteParam)
      ? (siteParam as SiteType)
      : 'all';
  const order =
    orderParam && Object.keys(SORT_ORDERS).includes(orderParam)
      ? (orderParam as SortOrder)
      : 'latest';
  const limit = 24; // 1ページあたりの記事数

  // D1データベースからページネーション対応でデータを取得
  const paginatedData = await getArticlesWithPagination(env.DB, {
    page,
    limit,
    site,
    order,
  });

  return (
    <div className='max-w-[80rem] mx-auto px-4 py-8'>
      <div className='pt-6 pb-8'>
        <h1 className='text-4xl md:text-6xl font-extrabold tracking-tight text-[#141413]'>
          CC-Vault
        </h1>
        <p className='mt-5 text-lg text-[#7D4A38]'>
          Claude Code中心の技術トレンドをまとめてチェック
        </p>
      </div>

      <ArticleContainer
        paginatedData={paginatedData}
        initialSite={site}
        initialOrder={order}
      />
    </div>
  );
}
