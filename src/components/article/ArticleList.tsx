import type { Article } from '@/types';
import ArticleCard from './ArticleCard';

type ArticleListProps = {
  articles: Article[];
};

/**
 * 記事一覧コンポーネント
 * 複数の記事カードを表示するServerComponent
 */
export default function ArticleList({ articles }: ArticleListProps) {
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
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4'>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
