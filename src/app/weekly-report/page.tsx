import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import WeekNavigation from '@/components/weekly-report/WeekNavigation';
import TopArticles from '@/components/weekly-report/TopArticles';
import {
  generateWeeklyReportGrouped,
  getAdjacentWeeks,
  isValidDateString,
  getCurrentJSTDate,
  getStartOfWeek,
  formatDateToString,
  formatDateToJapanese,
} from '@/lib/weekly-report';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { notFound } from 'next/navigation';
import { getLatestCompletedWeek, hasWeeklyReportData } from '@/lib/cloudflare';
import { getAIAgentFromHeaders } from '@/config/ai-agents';

/**
 * ウィークリーレポートページのprops
 */
type Props = {
  /** 週の指定（yyyy-mm-dd形式の開始日） */
  searchParams: Promise<{ week?: string }>;
};

/**
 * ウィークリーレポートページのメタデータ生成
 */
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { env } = await getCloudflareContext({ async: true });
  const { week } = await searchParams;

  // AIエージェント識別
  const aiAgent = await getAIAgentFromHeaders();

  // 無効な日付の場合は404にリダイレクト
  if (week && !isValidDateString(week)) {
    notFound();
  }

  const today = getCurrentJSTDate();
  const currentWeekStart = getStartOfWeek(today);

  // 最新完成週を取得、なければ現在週をフォールバック
  const latestCompletedWeek = await getLatestCompletedWeek(env.DB);
  const selectedWeek =
    week || latestCompletedWeek || formatDateToString(currentWeekStart);

  const weeklyReport = await generateWeeklyReportGrouped({
    weekStartDate: selectedWeek,
    db: env.DB,
    aiAgent: aiAgent.id === 'default' ? undefined : aiAgent.id,
  });
  const title = `ウィークリーレポート - ${weeklyReport.weekRange.label}`;
  const description = `${weeklyReport.weekRange.startDate}週の週間人気記事サイト別ランキングをご覧ください。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      title,
      description,
    },
  };
}

/**
 * ウィークリーレポートページ
 */
export default async function WeeklyReportPage({ searchParams }: Props) {
  const { env } = await getCloudflareContext({ async: true });
  const { week } = await searchParams;

  // AIエージェント識別
  const aiAgent = await getAIAgentFromHeaders();

  // 無効な日付の場合は404にリダイレクト
  if (week && !isValidDateString(week)) {
    notFound();
  }

  const today = getCurrentJSTDate();
  const currentWeekStart = getStartOfWeek(today);

  // 最新完成週を取得、なければ現在週をフォールバック
  const latestCompletedWeek = await getLatestCompletedWeek(env.DB);
  const selectedWeek =
    week || latestCompletedWeek || formatDateToString(currentWeekStart);

  // 週間レポートデータを生成
  const weeklyReport = await generateWeeklyReportGrouped({
    weekStartDate: selectedWeek,
    db: env.DB,
    aiAgent: aiAgent.id === 'default' ? undefined : aiAgent.id,
  });
  const adjacentWeeks = getAdjacentWeeks(selectedWeek);

  // データ存在チェック
  const [hasPreviousData, hasNextData] = await Promise.all([
    hasWeeklyReportData({
      db: env.DB,
      weekStartDate: adjacentWeeks.previous.startDate,
    }),
    hasWeeklyReportData({
      db: env.DB,
      weekStartDate: adjacentWeeks.next.startDate,
    }),
  ]);

  if (
    weeklyReport.siteRankings.length === 0 ||
    weeklyReport.siteRankings.every((ranking) => ranking.articles.length === 0)
  ) {
    notFound();
  }

  // データ取得日時点（週終了日を年月日表示でフォーマット）
  const snapshotDate = formatDateToJapanese(weeklyReport.weekRange.endDate);

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* ヘッダー */}
      <div className='mb-6'>
        <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
          <div className='order-2 sm:order-1'>
            <Link href='/'>
              <Button
                variant='outline'
                size='sm'
                className='border-[#E0DFDA] text-[#141413] hover:bg-[#DB8163] hover:text-white hover:border-[#DB8163]'
              >
                <ArrowLeft className='w-4 h-4 mr-1' />
                ホームに戻る
              </Button>
            </Link>
          </div>
          <h1 className='text-2xl sm:text-3xl font-bold text-[#141413] order-1 sm:order-2'>
            ウィークリーレポート
          </h1>
        </div>
      </div>

      {/* 週間ナビゲーション */}
      <WeekNavigation
        currentWeek={weeklyReport.weekRange}
        previousWeek={adjacentWeeks.previous}
        nextWeek={adjacentWeeks.next}
        hasPreviousData={hasPreviousData}
        hasNextData={hasNextData}
      />

      {/* 週間人気記事サイト別ランキング */}
      <TopArticles
        siteRankings={weeklyReport.siteRankings}
        weekLabel={weeklyReport.weekRange.label}
        overallSummary={weeklyReport.overallSummary}
      />

      {/* フッター */}
      <div className='mt-12 text-center text-sm text-[#141413] opacity-70 space-y-2'>
        <p>
          データは毎週更新されます。最新の情報については
          <Link href='/' className='text-[#DB8163] hover:underline'>
            トップページ
          </Link>
          をご確認ください。
        </p>
        <p className='text-xs'>
          ※ いいね・ブックマーク数は{snapshotDate}時点のものです。
        </p>
        <p className='text-xs'>
          ※
          AIによる要約は誤りを含むことがあります。正確な情報については元の記事をご確認ください。
        </p>
      </div>
    </div>
  );
}
