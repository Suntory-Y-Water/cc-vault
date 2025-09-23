import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SITE_CONFIGS } from '@/lib/constants';
import type { Article } from '@/types';
import { Heart, Bookmark, ArrowUpRight } from 'lucide-react';

type ArticleCardProps = {
  article: Article;
};

/**
 * 記事カードコンポーネント
 * 要件に基づいて記事情報を表示するServerComponent
 *
 * AIエージェント別テーマ対応:
 * - ai-themed-bg: エージェント別背景色
 * - ai-themed-border: エージェント別ボーダー色
 * - ai-themed-text: エージェント別テキスト色
 * - ai-themed-button: エージェント別ボタンスタイル
 * - ai-themed-badge: エージェント別バッジスタイル
 */
export default function ArticleCard({ article }: ArticleCardProps) {
  const siteConfig = SITE_CONFIGS[article.site];

  // 日付を yyyy-mm-dd 形式でフォーマット
  const formatDate = (dateString: string): string => {
    return new Date(dateString)
      .toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\//g, '-');
  };

  return (
    <Card className='ai-themed-bg ai-themed-border hover:shadow-lg transition-shadow duration-200'>
      <CardContent className='p-6'>
        <div className='flex flex-col'>
          {/* サイトバッジと投稿日時 */}
          <div className='flex items-center gap-3 mb-3'>
            <Badge
              style={{
                backgroundColor: siteConfig.color,
                color: 'white',
                border: 'none',
              }}
              className='text-xs font-medium px-2 py-1'
            >
              {siteConfig.displayName}
            </Badge>
            <span className='text-sm ai-themed-text opacity-70'>
              {formatDate(article.publishedAt)}
            </span>
          </div>

          {/* 記事タイトル */}
          <h2 className='text-lg font-semibold ai-themed-text mb-3 line-clamp-3 leading-6'>
            {article.title}
          </h2>

          {/* 著者名 */}
          <div className='mb-4'>
            <span className='text-sm ai-themed-text opacity-70'>
              著者: {article.author}
            </span>
          </div>

          {/* エンゲージメント指標と読むボタン */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4 text-sm ai-themed-text opacity-70'>
              {/* はてなサイト以外の場合のみいいねを表示 */}
              {article.site !== 'hatena' && (
                <div className='flex items-center gap-1'>
                  <Heart className='w-4 h-4' />
                  <span>{article.engagement.likes}</span>
                </div>
              )}
              <div className='flex items-center gap-1'>
                <Bookmark className='w-4 h-4' />
                <span>{article.engagement.bookmarks}</span>
              </div>
            </div>

            {/* 続きを読むリンク */}
            <a
              href={article.url}
              target='_blank'
              rel='noopener noreferrer'
              className='ai-themed-button inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 border-none'
            >
              読む
              <ArrowUpRight className='w-4 h-4' />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
