import ArticleContainer from '@/components/article/ArticleContainer';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getArticlesFromD1 } from '@/lib/cloudflare';

/** 1時間で再検証 */
export const revalidate = 3600;

/**
 * ホームページコンポーネント
 * データ取得をサーバーサイドで実行し、結果をClient Componentに渡す
 */
export default async function HomePage() {
  const { env } = await getCloudflareContext({ async: true });

  // D1データベースからデータを取得
  const allArticles = await getArticlesFromD1(env.DB);

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

      <ArticleContainer articles={allArticles} />
    </div>
  );
}
