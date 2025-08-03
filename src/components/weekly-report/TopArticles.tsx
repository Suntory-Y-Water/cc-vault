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
import type { WeeklyArticle, SiteRanking } from '@/types';
import { SITE_CONFIGS } from '@/lib/constants';

type TopArticlesProps = {
  /** サイト別ランキングデータ */
  siteRankings: SiteRanking[];
  /** 週の範囲ラベル */
  weekLabel: string;
  /** AI生成全体要約 */
  overallSummary: string | null;
};

/**
 * 週間人気記事サイト別ランキングコンポーネント
 * 各サイトごとのランキングを表示するServerComponent
 */
export default function TopArticles({
  siteRankings,
  weekLabel,
  overallSummary,
}: TopArticlesProps) {
  /**
   * サイトバッジの色を取得
   */
  const getSiteBadgeColor = (site: string) => {
    const siteConfig = SITE_CONFIGS[site];
    if (siteConfig) {
      return `text-white`;
    }
    return 'bg-[#E0DFDA] text-[#141413]';
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
   * 記事カードをレンダリング
   */
  function renderArticleCard(article: WeeklyArticle) {
    return (
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
                  <Badge
                    className={getSiteBadgeColor(article.site)}
                    style={{
                      backgroundColor: SITE_CONFIGS[article.site]?.color,
                    }}
                  >
                    {SITE_CONFIGS[article.site]?.displayName || article.site}
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
                  {article.summary}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-[#141413]'>
          週間人気記事サイト別ランキング
        </h2>
        <div className='flex items-center gap-2 text-sm text-[#141413] opacity-70'>
          <TrendingUp className='w-4 h-4' />
          <span>{weekLabel}</span>
        </div>
      </div>

      {/* AI生成全体要約セクション */}
      {overallSummary && (
        <Card className='border-[#E0DFDA] bg-gradient-to-r from-[#FAF9F5] to-[#F7F6F1]'>
          <CardContent className='p-6'>
            <div className='flex items-center gap-3 mb-4'>
              <Bot className='w-6 h-6 text-[#DB8163]' />
              <h3 className='text-xl font-bold text-[#141413]'>
                今週のトレンド要約
              </h3>
            </div>
            <div className='prose prose-slate max-w-none'>
              <p className='text-[#141413] leading-relaxed text-base'>
                {overallSummary}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* サイト別セクション */}
      {siteRankings.map(
        (siteRanking) =>
          // サイトに記事がある場合のみ表示
          siteRanking.articles.length > 0 && (
            <div key={siteRanking.site} className='space-y-4'>
              {/* サイトヘッダー */}
              <div className='flex items-center gap-3 pb-3 border-b border-[#E0DFDA]'>
                <div
                  className='w-4 h-4 rounded'
                  style={{
                    backgroundColor: SITE_CONFIGS[siteRanking.site]?.color,
                  }}
                />
                <h3 className='text-xl font-bold text-[#141413]'>
                  {SITE_CONFIGS[siteRanking.site]?.displayName ||
                    siteRanking.site}
                </h3>
                <span className='text-sm text-[#141413] opacity-60'>
                  TOP {siteRanking.articles.length}
                </span>
              </div>

              {/* サイトの記事一覧 */}
              <div className='grid gap-3'>
                {siteRanking.articles.map((article) =>
                  renderArticleCard(article),
                )}
              </div>
            </div>
          ),
      )}
    </div>
  );
}
