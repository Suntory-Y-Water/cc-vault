import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ExternalLink,
  TrendingUp,
  Clock,
  Bot,
  Heart,
  Bookmark,
} from 'lucide-react';
import type { WeeklyArticle } from '@/types';
import { notFound } from 'next/navigation';

type TopArticlesProps = {
  /** 週間人気記事トップ10 */
  articles: WeeklyArticle[];
  /** 週の範囲ラベル */
  weekLabel: string;
};

/**
 * 週間人気記事トップ10コンポーネント
 * 週間での人気記事ランキングを表示するServerComponent
 */
export default function TopArticles({ articles, weekLabel }: TopArticlesProps) {
  if (articles.length === 0) {
    notFound();
  }

  /**
   * サイトバッジの色を取得
   */
  const getSiteBadgeColor = (site: string) => {
    const colors = {
      hatena: 'bg-[#00A4DE] text-white',
      qiita: 'bg-[#55C500] text-white',
      zenn: 'bg-[#3EA8FF] text-white',
      note: 'bg-[#41C9B4] text-white',
      docs: 'bg-[#6B46C1] text-white',
    };
    return colors[site as keyof typeof colors] || 'bg-[#E0DFDA] text-[#141413]';
  };

  /**
   * 日付を相対的な形式でフォーマット
   */
  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays === 0) return '今日';
    if (diffInDays === 1) return '昨日';
    if (diffInDays < 7) return `${diffInDays}日前`;
    return date.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' });
  };

  /**
   * ランキング番号のスタイルを取得
   */
  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-[#FFD700] text-[#141413] font-bold';
    if (rank === 2) return 'bg-[#C0C0C0] text-[#141413] font-bold';
    if (rank === 3) return 'bg-[#CD7F32] text-white font-bold';
    return 'bg-[#E0DFDA] text-[#141413] font-medium';
  };

  /**
   * AI生成要約のダミーテキストを取得
   */
  const getAISummary = (_title: string) => {
    const summaries = [
      'この記事では、最新の技術トレンドとベストプラクティスについて解説しています。実践的な例とともに、開発者にとって有用な情報を提供しています。',
      'プロジェクトの効率化と品質向上に役立つ手法を紹介。チーム開発における課題解決のヒントが含まれています。',
      '初心者から上級者まで参考になる内容で、段階的な学習アプローチを提案しています。コード例も豊富に掲載されています。',
    ];
    return summaries[Math.floor(Math.random() * summaries.length)];
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-[#141413]'>
          週間人気記事トップ10
        </h2>
        <div className='flex items-center gap-2 text-sm text-[#141413] opacity-70'>
          <TrendingUp className='w-4 h-4' />
          <span>{weekLabel}</span>
        </div>
      </div>

      <div className='grid gap-4'>
        {articles.map((article) => (
          <Card
            key={article.id}
            className='border-[#E0DFDA] hover:border-[#DB8163] transition-colors'
          >
            <CardContent className='p-4'>
              <div className='flex items-start gap-4'>
                {/* ランキング番号 */}
                <div className='flex-shrink-0'>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${getRankStyle(article.weeklyRank)}`}
                  >
                    {article.weeklyRank}
                  </div>
                </div>

                {/* 記事情報 */}
                <div className='flex-1 min-w-0'>
                  <div className='flex items-start justify-between gap-2 mb-2'>
                    <h3 className='font-semibold text-[#141413] line-clamp-2 hover:text-[#DB8163] transition-colors'>
                      <a
                        href={article.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='hover:underline'
                      >
                        {article.title}
                      </a>
                    </h3>
                    <ExternalLink className='w-4 h-4 text-[#141413] opacity-50 flex-shrink-0' />
                  </div>

                  <div className='flex items-center gap-2 text-sm text-[#141413] opacity-70 mb-2'>
                    <span>by {article.author}</span>
                    <span>•</span>
                    <div className='flex items-center gap-1'>
                      <Clock className='w-3 h-3' />
                      <span>{formatRelativeDate(article.publishedAt)}</span>
                    </div>
                  </div>

                  <div className='flex items-center justify-between mb-3'>
                    <div className='flex items-center gap-2'>
                      <Badge className={getSiteBadgeColor(article.site)}>
                        {article.site}
                      </Badge>
                      <div className='flex items-center gap-3 text-sm text-[#141413] opacity-70'>
                        <div className='flex items-center gap-1'>
                          <Heart className='w-4 h-4' />
                          <span>{article.engagement.likes}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Bookmark className='w-4 h-4' />
                          <span>{article.engagement.bookmarks}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI生成要約 */}
                  <div className='bg-[#FAF9F5] rounded-lg p-3 border border-[#E0DFDA]'>
                    <div className='flex items-center gap-2 mb-2'>
                      <Bot className='w-4 h-4 text-[#DB8163]' />
                      <span className='text-sm font-medium text-[#141413]'>
                        AI要約
                      </span>
                    </div>
                    <p className='text-sm text-[#141413] opacity-80 leading-relaxed'>
                      {getAISummary(article.title)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
