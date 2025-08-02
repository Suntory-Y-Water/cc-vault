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
import { notFound } from 'next/navigation';
import { SITE_CONFIGS } from '@/lib/constants';

type TopArticlesProps = {
  /** サイト別ランキングデータ */
  siteRankings: SiteRanking[];
  /** 週の範囲ラベル */
  weekLabel: string;
};

/**
 * 週間人気記事サイト別ランキングコンポーネント
 * 各サイトごとのランキングを表示するServerComponent
 */
export default function TopArticles({ siteRankings, weekLabel }: TopArticlesProps) {
  if (siteRankings.length === 0 || siteRankings.every(ranking => ranking.articles.length === 0)) {
    notFound();
  }

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
   * AI生成要約のダミーテキストを取得（記事タイトルに応じて）
   */
  const getAISummary = (title: string) => {
    // タイトルベースの要約パターン
    const titlePatterns: Record<string, string> = {
      'スラッシュコマンドを活用して Git/Github の操作を Claude Code にしてもらう':
        'Git/GitHub操作の自動化について詳しく解説。スラッシュコマンドを使ってClaude Codeに複雑なGit操作を依頼する方法を紹介し、開発効率の向上を実現しています。',
      '【VibeCodingChallenge#3】読書記録ツール':
        'VibeCodingChallengeの第3弾として読書記録ツールの開発過程を紹介。ユーザーフレンドリーなUIと効率的なデータ管理機能を実装し、読書習慣の改善に貢献する内容です。',
      'discord から claude-code を操作する(一時的な)サーバーを建てる':
        'DiscordボットとClaude Codeを連携させる革新的なアプローチを解説。チーム開発における効率化とコミュニケーション改善を実現する実装方法を詳しく紹介しています。',
      AIコーディングを活用したレガシーコード適応への道3:
        'レガシーシステムのモダン化におけるAIコーディング技術の活用法を解説。段階的なアプローチで既存コードベースを改善する実践的な手法を紹介しています。',
      'CLAUDE.mdに従わない！読まない！ときの対策':
        'AI開発においてCLAUDE.mdの指示が適切に機能しない場合の対処法を解説。プロンプトエンジニアリングの観点から効果的な解決策を提案しています。',
      複数デバイスに対応したccusageラッパーを作った:
        'クロスプラットフォーム対応のccusageラッパー開発について詳しく解説。複数デバイス間での一貫した開発体験を実現する実装方法を紹介しています。',
      'GitHub - mizchi/ai-coding-guide-202507':
        'AI時代のコーディングガイドラインを包括的に紹介。効率的なAI活用方法から品質管理まで、現代の開発者必須の知識を体系的に整理した貴重なリソースです。',
      'Claude Code 初学者 勉強会 2の資料をまとめます｜カレーちゃん':
        'Claude Code初学者向けの学習資料を分かりやすくまとめた内容。基本的な使い方から実践的なTipsまで、初心者が躓きやすいポイントを丁寧に解説しています。',
      '「先週何したっけ？」をゼロに：Obsidian + Claude Codeを業務アシスタントに':
        'ObsidianとClaude Codeを組み合わせた業務効率化システムの構築方法を詳しく解説。タスク管理と振り返りの自動化により、生産性向上を実現する革新的なアプローチです。',
    };

    // 直接マッチするものがあれば返す
    if (titlePatterns[title]) {
      return titlePatterns[title];
    }

    // キーワードベースのフォールバック要約
    if (title.includes('Claude Code') || title.includes('claude-code')) {
      return 'Claude Codeの活用方法や実践的なTipsを紹介する記事。AI支援開発における効率的なワークフローの構築について詳しく解説しています。';
    }
    if (title.includes('Git') || title.includes('GitHub')) {
      return 'Git/GitHubの効率的な使い方や自動化手法について解説。バージョン管理とチーム開発の生産性向上に役立つ実践的な内容です。';
    }
    if (title.includes('AI') || title.includes('コーディング')) {
      return 'AI技術を活用したコーディング手法について詳しく解説。現代の開発者が知っておくべき効率化テクニックを紹介しています。';
    }
    if (title.includes('レガシー') || title.includes('適応')) {
      return 'レガシーシステムのモダン化や技術的負債の解決について実践的なアプローチを紹介。既存システムの改善方法を詳しく解説しています。';
    }

    // デフォルトの要約
    return 'この記事では、最新の技術トレンドとベストプラクティスについて解説しています。実践的な例とともに、開発者にとって有用な情報を提供しています。';
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
                    {SITE_CONFIGS[article.site]?.displayName ||
                      article.site}
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

      {/* サイト別セクション */}
      {siteRankings.map((siteRanking) => (
        <div key={siteRanking.site} className='space-y-4'>
          {/* サイトヘッダー */}
          <div className='flex items-center gap-3 pb-3 border-b border-[#E0DFDA]'>
            <div 
              className='w-4 h-4 rounded'
              style={{ backgroundColor: SITE_CONFIGS[siteRanking.site]?.color }}
            />
            <h3 className='text-xl font-bold text-[#141413]'>
              {SITE_CONFIGS[siteRanking.site]?.displayName || siteRanking.site}
            </h3>
            <span className='text-sm text-[#141413] opacity-60'>
              TOP {siteRanking.articles.length}
            </span>
          </div>

          {/* サイトの記事一覧 */}
          <div className='grid gap-3'>
            {siteRanking.articles.map((article) => renderArticleCard(article))}
          </div>
        </div>
      ))}
    </div>
  );
}
