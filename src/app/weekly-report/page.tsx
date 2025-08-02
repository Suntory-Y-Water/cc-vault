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
} from '@/lib/weekly-report';

/**
 * ウィークリーレポートページのメタデータ生成
 */
export async function generateMetadata({
  searchParams,
}: WeeklyReportPageProps): Promise<Metadata> {
  const { week } = await searchParams;
  const today = new Date();
  const currentWeekStart = getStartOfWeek(today);
  const selectedWeek = week || currentWeekStart.toISOString().split('T')[0];

  const weeklyReport = await generateWeeklyReportGrouped({
    weekStartDate: selectedWeek,
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
  const { week } = await searchParams;
  const today = new Date();
  const currentWeekStart = getStartOfWeek(today);
  const selectedWeek = week || currentWeekStart.toISOString().split('T')[0];

  // 週間レポートデータを生成
  const weeklyReport = await generateWeeklyReportGrouped({
    weekStartDate: selectedWeek,
  });
  const adjacentWeeks = getAdjacentWeeks(selectedWeek);

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
      />

      {/* 週間人気記事サイト別ランキング */}
      <TopArticles
        siteRankings={weeklyReport.siteRankings}
        weekLabel={weeklyReport.weekRange.label}
      />

      {/* フッター */}
      <div className='mt-12 text-center text-sm text-[#141413] opacity-70'>
        <p>
          データは毎週更新されます。最新の情報については
          <Link href='/' className='text-[#DB8163] hover:underline'>
            トップページ
          </Link>
          をご確認ください。
        </p>
      </div>
    </div>
  );
}
