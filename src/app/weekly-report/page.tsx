import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import WeekNavigation from '@/components/weekly-report/WeekNavigation';
import TopArticles from '@/components/weekly-report/TopArticles';
import type { WeeklyReportPageProps } from '@/types';
import {
  generateWeeklyReportGrouped,
  getAdjacentWeeks,
  getStartOfWeek,
  hasWeeklyData,
} from '@/lib/weekly-report';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { notFound } from 'next/navigation';

/**
 * ウィークリーレポートページのメタデータ生成
 */
export async function generateMetadata({
  searchParams,
}: WeeklyReportPageProps): Promise<Metadata> {
  const { env } = await getCloudflareContext({ async: true });
  const { week } = await searchParams;
  const today = new Date();
  const currentWeekStart = getStartOfWeek(today);
  const selectedWeek = week || currentWeekStart.toISOString().split('T')[0];

  const weeklyReport = await generateWeeklyReportGrouped({
    weekStartDate: selectedWeek,
    db: env.DB,
  });
  const title = `ウィークリーレポート - ${weeklyReport.weekRange.label}`;
  const description = `${weeklyReport.weekRange.label}の週間人気記事サイト別ランキングをご覧ください。`;

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
export default async function WeeklyReportPage({
  searchParams,
}: WeeklyReportPageProps) {
  const { env } = await getCloudflareContext({ async: true });
  const { week } = await searchParams;
  const today = new Date();
  const currentWeekStart = getStartOfWeek(today);
  const selectedWeek = week || currentWeekStart.toISOString().split('T')[0];

  // 週間レポートデータを生成
  const weeklyReport = await generateWeeklyReportGrouped({
    weekStartDate: selectedWeek,
    db: env.DB,
  });
  const adjacentWeeks = getAdjacentWeeks(selectedWeek);

  // データ存在チェック
  const [hasPreviousData, hasNextData] = await Promise.all([
    hasWeeklyData(adjacentWeeks.previous, env.DB),
    hasWeeklyData(adjacentWeeks.next, env.DB),
  ]);

  if (
    weeklyReport.siteRankings.length === 0 ||
    weeklyReport.siteRankings.every((ranking) => ranking.articles.length === 0)
  ) {
    notFound();
  }

  // データ取得日時点（週終了日をyyyy-mm-dd形式で表示）
  const snapshotDate = weeklyReport.weekRange.endDate;

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* ヘッダー */}
      <div className='flex items-center gap-4 mb-6'>
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
        <h1 className='text-3xl font-bold text-[#141413]'>
          ウィークリーレポート
        </h1>
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
