import { fetchHtmlDocument, fetchExternalData } from '@/lib/fetchers';
import { getZennTopicsData } from '@/lib/parser';
import MainTabs from '@/components/layout/MainTabs';
import SiteFilter from '@/components/layout/SiteFilter';
import ArticleList from '@/components/article/ArticleList';
import {
  Article,
  QiitaPost,
  SortOrder,
  SiteType,
  SORT_ORDERS,
  SITE_NAMES,
} from '@/types';
import { notFound } from 'next/navigation';
import { convertToJstString } from '@/lib/utils';

type PageProps = {
  searchParams: Promise<{
    order?: SortOrder;
    site?: SiteType | 'all';
    page?: string;
  }>;
};

/**
 * クエリパラメータのバリデーションを行う
 * @param order - ソート順パラメータ
 * @param site - サイトフィルターパラメータ
 */
function validateSearchParams(order?: string, site?: string) {
  // orderパラメータのバリデーション
  if (order && !(order in SORT_ORDERS)) {
    notFound();
  }

  // siteパラメータのバリデーション（'all'も許可）
  if (site && site !== 'all' && !(site in SITE_NAMES)) {
    notFound();
  }
}

/**
 * ホームページコンポーネント
 * クエリパラメータのバリデーションを行い、想定外の値の場合は404ページを表示
 */
export default async function HomePage({ searchParams }: PageProps) {
  const { order = 'latest', site = 'all' } = await searchParams;

  // クエリパラメータのバリデーション実行
  validateSearchParams(order, site);

  // 並列処理で全データを取得
  const [zennData, qiitaData] = await Promise.all([
    // Zennのトピックスページから記事を取得
    (async () => {
      const zennOrderParam = order === 'latest' ? 'latest' : 'daily';
      const zennTopicsUrl = `https://zenn.dev/topics/claudecode?order=${zennOrderParam}`;

      const document = await fetchHtmlDocument(zennTopicsUrl, {
        revalidate: 3600,
        tags: ['zenn-topics'],
      });

      return getZennTopicsData({ document });
    })(),

    // QiitaのAPIから記事を取得
    (async () => {
      // Qiitaは新着順のみサポート（APIの制限）
      const qiitaQuery =
        order === 'latest' ? 'tag:claudecode' : 'tag:claudecode stocks:>0'; // トレンド時はストック数でフィルタ

      const qiitaData = await fetchExternalData<QiitaPost[]>(
        `https://qiita.com/api/v2/items?query=${encodeURIComponent(qiitaQuery)}`,
        {
          revalidate: 3600,
          tags: ['qiita-articles'],
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.QIITA_ACCESS_TOKEN}`,
          },
        },
      );

      return qiitaData;
    })(),
  ]);

  // 全記事を統合
  const allArticles: Article[] = [
    // Zennの記事
    ...zennData.articles.map((post) => ({
      id: `zenn-${post.id}`,
      title: post.title,
      url: `https://zenn.dev${post.path}`,
      author: post.author,
      publishedAt: convertToJstString(post.published_at),
      site: 'zenn' as const,
      engagement: {
        likes: post.likedCount,
        bookmarks: post.bookmarkedCount,
      },
    })),
    // Qiitaの記事
    ...qiitaData.map((post) => ({
      id: `qiita-${post.id}`,
      title: post.title,
      url: post.url,
      author: post.user.name || post.user.id, // ユーザー名が空の場合はIDを使用
      publishedAt: convertToJstString(post.created_at),
      site: 'qiita' as const,
      engagement: {
        likes: post.likes_count,
        bookmarks: post.stocks_count,
      },
    })),
  ];

  // クエリパラメータによってフィルタリング
  function getFilteredArticles() {
    if (site === 'all') return allArticles;
    return allArticles.filter((article) => article.site === site);
  }

  // ソート処理
  function getSortedArticles(articles: Article[]) {
    if (order === 'latest') {
      return articles.sort((a, b) => (a.publishedAt > b.publishedAt ? -1 : 1));
    }

    // トレンド順: エンゲージメント重視
    return articles.sort((a, b) => {
      const aEngagement = a.engagement.likes + a.engagement.bookmarks;
      const bEngagement = b.engagement.likes + b.engagement.bookmarks;
      return bEngagement - aEngagement;
    });
  }
  const filteredArticles = getFilteredArticles();
  const articles = getSortedArticles(filteredArticles);

  return (
    <div className='max-w-[80rem] mx-auto px-4 py-8'>
      <div className='pt-6 pb-8'>
        <h1 className='text-4xl md:text-6xl font-extrabold tracking-tight text-[#141413]'>
          CC-Vault
        </h1>
        <p className='mt-5 text-lg text-[#7D4A38]'>
          Claude Code中心の技術トレンドをまとめてチェック
        </p>
      </div>

      {/* フィルターボタン */}
      <div className='flex flex-wrap gap-2 mb-8'>
        <SiteFilter activeSite={site} searchParams={{ order }} />
      </div>

      {/* タブ */}
      <div>
        <MainTabs order={order} />

        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
          {/* 初期開発ではウィークリーレポート非表示 */}
          {/* <Link href='/weekly-report'>
            <Button
              variant='outline'
              className='border-[#DB8163] text-[#DB8163] hover:bg-[#DB8163] hover:text-white transition-colors font-medium'
            >
              ウィークリーレポート
            </Button>
          </Link> */}
        </div>

        <ArticleList articles={articles} />
      </div>
    </div>
  );
}
