import type { Article, PaginatedArticles } from '@/types';
import ArticleCard from './ArticleCard';
import Pagination from './Pagination';

type ArticleListProps = {
  articles: Article[];
  paginationData?: PaginatedArticles;
  searchParams?: {
    order?: 'latest' | 'trending';
    site?: string;
  };
};

/**
 * 記事一覧コンポーネント
 * 複数の記事カードとページネーションを表示
 */
export default function ArticleList({
  articles,
  paginationData,
  searchParams = {},
}: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-[#141413] opacity-70 text-lg'>
          記事が見つかりませんでした。
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4'>
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* ページネーション */}
      {paginationData && paginationData.totalPages > 1 && (
        <Pagination
          currentPage={paginationData.currentPage}
          totalPages={paginationData.totalPages}
          hasNext={paginationData.hasNext}
          hasPrevious={paginationData.hasPrevious}
          searchParams={searchParams}
        />
      )}
    </div>
  );
}
