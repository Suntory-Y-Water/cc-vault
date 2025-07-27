'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { PaginatedArticles, SortOrder, SiteType } from '@/types';
import SiteFilter from '@/components/layout/SiteFilter';
import MainTabs from '@/components/layout/MainTabs';
import ArticleList from '@/components/article/ArticleList';

type Props = {
  paginatedData: PaginatedArticles;
  initialSite: SiteType;
  initialOrder: SortOrder;
};

/**
 * 記事フィルター管理コンポーネント
 * URL パラメータベースのフィルタリングとソート機能を提供
 */
export default function ArticleContainer({
  paginatedData,
  initialSite,
  initialOrder,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * サイトフィルターの変更処理
   * @param site - 選択されたサイト
   */
  const handleSiteChange = (site: SiteType) => {
    const params = new URLSearchParams(searchParams.toString());
    if (site === 'all') {
      params.delete('site');
    } else {
      params.set('site', site);
    }
    params.delete('page'); // ページをリセット
    router.push(`/?${params.toString()}`);
  };

  /**
   * ソート順の変更処理
   * @param order - 選択されたソート順
   */
  const handleOrderChange = (order: SortOrder) => {
    const params = new URLSearchParams(searchParams.toString());
    if (order === 'latest') {
      params.delete('order');
    } else {
      params.set('order', order);
    }
    params.delete('page'); // ページをリセット
    router.push(`/?${params.toString()}`);
  };

  return (
    <div>
      <div className='flex flex-wrap gap-2 mb-8'>
        <SiteFilter activeSite={initialSite} onSiteChange={handleSiteChange} />
      </div>

      <div>
        <MainTabs order={initialOrder} onOrderChange={handleOrderChange} />

        <ArticleList
          articles={paginatedData.articles}
          paginationData={paginatedData}
          searchParams={{
            site: initialSite !== 'all' ? initialSite : undefined,
            order: initialOrder !== 'latest' ? initialOrder : undefined,
          }}
        />
      </div>
    </div>
  );
}
