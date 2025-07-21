'use client';

import { useState, useMemo } from 'react';
import { Article, SortOrder, SiteType } from '@/types';
import SiteFilter from '@/components/layout/SiteFilter';
import MainTabs from '@/components/layout/MainTabs';
import ArticleList from '@/components/article/ArticleList';

type Props = {
  articles: Article[];
};

/**
 * 記事フィルター管理コンポーネント
 * 記事のフィルタリングとソート機能を提供
 */
export default function ArticleContainer({ articles }: Props) {
  const [selectedSite, setSelectedSite] = useState<SiteType>('all');
  const [selectedOrder, setSelectedOrder] = useState<SortOrder>('latest');

  const filteredArticles = useMemo(() => {
    if (selectedSite !== 'all') {
      articles = articles.filter((article) => article.site === selectedSite);
    }

    articles = [...articles].sort((a, b) => {
      if (selectedOrder === 'latest') {
        return (
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      }
      const aScore = a.engagement.likes + a.engagement.bookmarks;
      const bScore = b.engagement.likes + b.engagement.bookmarks;
      return bScore - aScore;
    });

    return articles;
  }, [articles, selectedSite, selectedOrder]);

  return (
    <div>
      <div className='flex flex-wrap gap-2 mb-8'>
        <SiteFilter activeSite={selectedSite} onSiteChange={setSelectedSite} />
      </div>

      <div>
        <MainTabs order={selectedOrder} onOrderChange={setSelectedOrder} />

        <ArticleList articles={filteredArticles} />
      </div>
    </div>
  );
}
