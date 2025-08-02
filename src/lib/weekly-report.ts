/**
 * ウィークリーレポート関連のユーティリティ関数（シンプル版）
 */

import {
  startOfWeek,
  endOfWeek,
  addWeeks,
  getWeek,
  getYear,
  isAfter,
  isSameDay,
  parseISO,
  format,
} from 'date-fns';
import type {
  WeekRange,
  WeeklyArticle,
  WeeklyReportGrouped,
  ArticleRow,
  SiteRanking,
} from '@/types';

/**
 * 指定された日付から週の開始日を取得（月曜日始まり）
 */
export function getStartOfWeek(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

/**
 * 指定された日付から週の終了日を取得（月曜日始まり）
 */
export function getEndOfWeek(date: Date): Date {
  return endOfWeek(date, { weekStartsOn: 1 });
}

/**
 * 週の範囲を生成
 */
export function createWeekRange(startDate: Date): WeekRange {
  const start = getStartOfWeek(startDate);
  const end = getEndOfWeek(startDate);

  const year = getYear(start);
  const weekNumber = getWeek(start, { weekStartsOn: 1 });

  return {
    startDate: format(start, 'yyyy-MM-dd'),
    endDate: format(end, 'yyyy-MM-dd'),
    year,
    weekNumber,
    label: `#${weekNumber}`,
  };
}

/**
 * 前週・次週の週範囲を取得
 */
export function getAdjacentWeeks(currentWeek: string): {
  previous: WeekRange;
  next: WeekRange;
} {
  const current = parseISO(currentWeek);

  // 前週（1週間前）
  const previousWeekDate = addWeeks(current, -1);
  const previousWeekStart = startOfWeek(previousWeekDate, { weekStartsOn: 1 });

  // 次週（1週間後）
  const nextWeekDate = addWeeks(current, 1);
  const nextWeekStart = startOfWeek(nextWeekDate, { weekStartsOn: 1 });

  return {
    previous: createWeekRange(previousWeekStart),
    next: createWeekRange(nextWeekStart),
  };
}

/**
 * 現在の週が最新の週かどうかを判定
 */
export function isCurrentWeek(weekStartDate: string): boolean {
  const today = new Date();
  const currentWeekStart = getStartOfWeek(today);
  const targetWeekStart = parseISO(weekStartDate);

  return isSameDay(currentWeekStart, targetWeekStart);
}

/**
 * 指定された週が未来の週かどうかを判定
 */
export function isFutureWeek(weekStartDate: string): boolean {
  const today = new Date();
  const currentWeekStart = getStartOfWeek(today);
  const targetWeekStart = parseISO(weekStartDate);

  return isAfter(targetWeekStart, currentWeekStart);
}

/**
 * ArticleRowをWeeklyArticleに変換
 */
export function convertArticleRowToWeeklyArticle({
  articleRow,
  rank,
}: {
  articleRow: ArticleRow;
  rank: number;
}): WeeklyArticle {
  return {
    id: articleRow.id,
    title: articleRow.title,
    url: articleRow.url,
    author: articleRow.author,
    publishedAt: articleRow.published_at.split('T')[0], // ISO日付をYYYY-MM-DD形式に変換
    site: articleRow.site,
    engagement: {
      likes: articleRow.likes,
      bookmarks: articleRow.bookmarks,
    },
    weeklyRank: rank,
  };
}

/**
 * 指定された週にデータが存在するかチェック
 * !これまえのモックなら動くけど？？
 */
export function hasWeeklyData(weekRange: WeekRange): boolean {
  const sqlArticleData: Record<string, boolean> = {
    '2025-07-21': true,
    '2025-07-14': true,
    '2025-07-07': true,
  };

  return sqlArticleData[weekRange.startDate] || false;
}

// 2025-07-21週のArticleRowデータ
const WEEK_2025_07_21_ZENN: ArticleRow[] = [
  {
    id: 'zenn-441329',
    title: 'discord から claude-code を操作する(一時的な)サーバーを建てる',
    url: 'https://zenn.dev/mizchi/articles/discord-claude-code-interface',
    author: 'mizchi',
    published_at: '2025-07-23T23:49:25',
    site: 'zenn',
    likes: 69,
    bookmarks: 28,
  },
  {
    id: 'zenn-432311',
    title:
      'スラッシュコマンドを活用して Git/Github の操作を Claude Code にしてもらう',
    url: 'https://zenn.dev/monox_dev/articles/a4ed225be78a77',
    author: 'm-shimoda',
    published_at: '2025-07-23T19:19:59',
    site: 'zenn',
    likes: 9,
    bookmarks: 3,
  },
  {
    id: 'zenn-431736',
    title: '【VibeCodingChallenge#3】読書記録ツール',
    url: 'https://zenn.dev/acntechjp/articles/edeb182b72fd88',
    author: 'Shota.Takiyanagi',
    published_at: '2025-07-24T07:00:01',
    site: 'zenn',
    likes: 4,
    bookmarks: 0,
  },
];

const WEEK_2025_07_21_QIITA: ArticleRow[] = [
  {
    id: 'qiita-5ad55f1a7723ec095429',
    title: 'CLAUDE.mdに従わない！読まない！ときの対策',
    url: 'https://qiita.com/godhexagon/items/5ad55f1a7723ec095429',
    author: 'godhexagon',
    published_at: '2025-07-25T19:28:39',
    site: 'qiita',
    likes: 1,
    bookmarks: 0,
  },
  {
    id: 'qiita-b91accbdbea053b56eb4',
    title: '複数デバイスに対応したccusageラッパーを作った',
    url: 'https://qiita.com/takumi3488/items/b91accbdbea053b56eb4',
    author: 'takumi3488',
    published_at: '2025-07-26T03:18:03',
    site: 'qiita',
    likes: 1,
    bookmarks: 0,
  },
  {
    id: 'qiita-24e70b77af541204548d',
    title: 'AIコーディングを活用したレガシーコード適応への道3',
    url: 'https://qiita.com/tonbi_attack/items/24e70b77af541204548d',
    author: 'tonbi_attack',
    published_at: '2025-07-25T20:08:15',
    site: 'qiita',
    likes: 0,
    bookmarks: 0,
  },
];

const WEEK_2025_07_21_HATENA: ArticleRow[] = [
  {
    id: 'hatena-1',
    title:
      '「先週何したっけ？」をゼロに：Obsidian + Claude Codeを業務アシスタントに - エムスリーテックブログ',
    url: 'https://www.m3tech.blog/entry/2025/06/29/110000',
    author: 'www.m3tech.blog',
    published_at: '2025-06-29T09:00:00',
    site: 'hatena',
    likes: 0,
    bookmarks: 610,
  },
  {
    id: 'hatena-2',
    title: 'Claude Code 初学者 勉強会 2の資料をまとめます｜カレーちゃん',
    url: 'https://note.com/currypurin/n/nef75ee78a65a',
    author: 'note.com/currypurin',
    published_at: '2025-07-08T09:00:00',
    site: 'hatena',
    likes: 0,
    bookmarks: 35,
  },
  {
    id: 'hatena-3',
    title: 'GitHub - mizchi/ai-coding-guide-202507',
    url: 'https://github.com/mizchi/ai-coding-guide-202507',
    author: 'github.com/mizchi',
    published_at: '2025-07-07T09:00:00',
    site: 'hatena',
    likes: 0,
    bookmarks: 15,
  },
];

// 2025-07-14週のArticleRowデータ
const WEEK_2025_07_14_ZENN: ArticleRow[] = [
  {
    id: 'zenn-w2-1',
    title: 'TypeScript + React で作るAIシステム',
    url: 'https://zenn.dev/dev_user_123/articles/typescript-react-ai',
    author: 'dev_user_123',
    published_at: '2025-07-15T19:19:59',
    site: 'zenn',
    likes: 45,
    bookmarks: 20,
  },
  {
    id: 'zenn-w2-2',
    title: 'Next.js 15で始めるGraphQL入門',
    url: 'https://zenn.dev/frontend_456/articles/nextjs-graphql-intro',
    author: 'frontend_456',
    published_at: '2025-07-17T07:00:01',
    site: 'zenn',
    likes: 25,
    bookmarks: 12,
  },
  {
    id: 'zenn-w2-3',
    title: 'WebAssemblyを使ったパフォーマンス最適化の実践',
    url: 'https://zenn.dev/performance_789/articles/webassembly-optimization',
    author: 'performance_789',
    published_at: '2025-07-16T23:49:25',
    site: 'zenn',
    likes: 18,
    bookmarks: 8,
  },
];

const WEEK_2025_07_14_QIITA: ArticleRow[] = [
  {
    id: 'qiita-w2-1',
    title: 'GraphQLのベストプラクティス 2025年版',
    url: 'https://qiita.com/qiita_engineer_789/items/graphql-best-practices',
    author: 'qiita_engineer_789',
    published_at: '2025-07-18T19:28:39',
    site: 'qiita',
    likes: 15,
    bookmarks: 6,
  },
  {
    id: 'qiita-w2-2',
    title: 'プロダクション環境でのServerless運用事例',
    url: 'https://qiita.com/dev_ops_101/items/serverless-production',
    author: 'dev_ops_101',
    published_at: '2025-07-19T03:18:03',
    site: 'qiita',
    likes: 12,
    bookmarks: 4,
  },
  {
    id: 'qiita-w2-3',
    title: 'WebAssemblyで困った時の対処法まとめ',
    url: 'https://qiita.com/troubleshooter_202/items/webassembly-troubleshooting',
    author: 'troubleshooter_202',
    published_at: '2025-07-18T20:08:15',
    site: 'qiita',
    likes: 8,
    bookmarks: 2,
  },
];

const WEEK_2025_07_14_HATENA: ArticleRow[] = [
  {
    id: 'hatena-w2-1',
    title: 'Docker導入で変わった開発体験 - メルカリテックブログ',
    url: 'https://www.mercari.tech.blog/entry/docker-development',
    author: 'mercari.tech.blog',
    published_at: '2025-07-15T09:00:00',
    site: 'hatena',
    likes: 0,
    bookmarks: 85,
  },
  {
    id: 'hatena-w2-2',
    title: 'Kubernetesを活用した新しい開発手法｜takeshi',
    url: 'https://note.com/takeshi/n/kubernetes-development',
    author: 'note.com/takeshi',
    published_at: '2025-07-16T09:00:00',
    site: 'hatena',
    likes: 0,
    bookmarks: 42,
  },
  {
    id: 'hatena-w2-3',
    title: 'GitHub - yamada/ai-toolkit',
    url: 'https://github.com/yamada/ai-toolkit',
    author: 'github.com/yamada',
    published_at: '2025-07-17T09:00:00',
    site: 'hatena',
    likes: 0,
    bookmarks: 28,
  },
];

// 2025-07-07週のArticleRowデータ
const WEEK_2025_07_07_ZENN: ArticleRow[] = [
  {
    id: 'zenn-w3-1',
    title: 'Next.js 15で始めるDocker入門',
    url: 'https://zenn.dev/frontend_101/articles/nextjs-docker-intro',
    author: 'frontend_101',
    published_at: '2025-07-08T19:19:59',
    site: 'zenn',
    likes: 32,
    bookmarks: 18,
  },
  {
    id: 'zenn-w3-2',
    title: 'TypeScript + React で作るKubernetesシステム',
    url: 'https://zenn.dev/dev_user_456/articles/typescript-kubernetes',
    author: 'dev_user_456',
    published_at: '2025-07-10T07:00:01',
    site: 'zenn',
    likes: 28,
    bookmarks: 15,
  },
  {
    id: 'zenn-w3-3',
    title: 'Serverlessを使ったパフォーマンス最適化の実践',
    url: 'https://zenn.dev/performance_123/articles/serverless-optimization',
    author: 'performance_123',
    published_at: '2025-07-09T23:49:25',
    site: 'zenn',
    likes: 22,
    bookmarks: 10,
  },
];

const WEEK_2025_07_07_QIITA: ArticleRow[] = [
  {
    id: 'qiita-w3-1',
    title: 'AIのベストプラクティス 2025年版',
    url: 'https://qiita.com/qiita_engineer_456/items/ai-best-practices',
    author: 'qiita_engineer_456',
    published_at: '2025-07-11T19:28:39',
    site: 'qiita',
    likes: 18,
    bookmarks: 8,
  },
  {
    id: 'qiita-w3-2',
    title: 'プロダクション環境でのGraphQL運用事例',
    url: 'https://qiita.com/dev_ops_789/items/graphql-production',
    author: 'dev_ops_789',
    published_at: '2025-07-12T03:18:03',
    site: 'qiita',
    likes: 14,
    bookmarks: 6,
  },
  {
    id: 'qiita-w3-3',
    title: 'Serverlessで困った時の対処法まとめ',
    url: 'https://qiita.com/troubleshooter_456/items/serverless-troubleshooting',
    author: 'troubleshooter_456',
    published_at: '2025-07-11T20:08:15',
    site: 'qiita',
    likes: 10,
    bookmarks: 4,
  },
];

const WEEK_2025_07_07_HATENA: ArticleRow[] = [
  {
    id: 'hatena-w3-1',
    title:
      'WebAssembly導入で変わった開発体験 - サイバーエージェントテックブログ',
    url: 'https://www.cyberagent.tech.blog/entry/webassembly-development',
    author: 'cyberagent.tech.blog',
    published_at: '2025-07-08T09:00:00',
    site: 'hatena',
    likes: 0,
    bookmarks: 95,
  },
  {
    id: 'hatena-w3-2',
    title: 'Dockerを活用した新しい開発手法｜akira',
    url: 'https://note.com/akira/n/docker-development',
    author: 'note.com/akira',
    published_at: '2025-07-09T09:00:00',
    site: 'hatena',
    likes: 0,
    bookmarks: 55,
  },
  {
    id: 'hatena-w3-3',
    title: 'GitHub - hiroshi/graphql-framework',
    url: 'https://github.com/hiroshi/graphql-framework',
    author: 'github.com/hiroshi',
    published_at: '2025-07-10T09:00:00',
    site: 'hatena',
    likes: 0,
    bookmarks: 38,
  },
];

/**
 * サイト別分割関数でSiteRankingを作成
 */
function createSiteRankings(
  articleRows: ArticleRow[],
  site: string,
): SiteRanking {
  return {
    site,
    articles: articleRows.map((articleRow, index) =>
      convertArticleRowToWeeklyArticle({
        articleRow,
        rank: index + 1,
      }),
    ),
  };
}

/**
 * 週間レポートのモックデータを取得（サイト別に整理済み）
 */
export async function fetchWeeklyReportData({
  weekRange,
}: {
  weekRange: WeekRange;
}): Promise<SiteRanking[]> {
  const weeklyData: Record<string, SiteRanking[]> = {
    '2025-07-21': [
      createSiteRankings(WEEK_2025_07_21_ZENN, 'zenn'),
      createSiteRankings(WEEK_2025_07_21_QIITA, 'qiita'),
      createSiteRankings(WEEK_2025_07_21_HATENA, 'hatena'),
    ],
    '2025-07-14': [
      createSiteRankings(WEEK_2025_07_14_ZENN, 'zenn'),
      createSiteRankings(WEEK_2025_07_14_QIITA, 'qiita'),
      createSiteRankings(WEEK_2025_07_14_HATENA, 'hatena'),
    ],
    '2025-07-07': [
      createSiteRankings(WEEK_2025_07_07_ZENN, 'zenn'),
      createSiteRankings(WEEK_2025_07_07_QIITA, 'qiita'),
      createSiteRankings(WEEK_2025_07_07_HATENA, 'hatena'),
    ],
  };

  return weeklyData[weekRange.startDate] || [];
}

/**
 * サイト別グループ化された週間レポートデータを生成
 */
export async function generateWeeklyReportGrouped({
  weekStartDate,
}: {
  weekStartDate: string;
}): Promise<WeeklyReportGrouped> {
  const weekRange = createWeekRange(new Date(weekStartDate));
  const siteRankings = await fetchWeeklyReportData({ weekRange });

  return {
    weekRange,
    siteRankings,
  };
}
