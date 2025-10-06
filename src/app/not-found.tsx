import { getAIAgentFromHeaders } from '@/config/ai-agents';
import { buildThemeStyle } from '@/lib/utils';

/**
 * 404エラー用ページコンポーネント
 */
export default async function NotFound() {
  const aiAgent = await getAIAgentFromHeaders();
  const themeStyles = buildThemeStyle(aiAgent.colors);

  return (
    <div className='max-w-[80rem] mx-auto px-4 py-8' style={themeStyles}>
      <div className='flex flex-col items-center justify-center min-h-[60vh] gap-6'>
        <div className='text-center'>
          <h1 className='text-6xl font-extrabold tracking-tight text-[var(--ai-text)] mb-4'>
            404
          </h1>
          <h2 className='text-2xl font-semibold text-[var(--ai-text)] mb-2'>
            ページが見つかりません
          </h2>
          <p className='text-lg text-[var(--ai-text)] opacity-70'>
            お探しのページは削除されたか、URLが間違っている可能性があります。
          </p>
        </div>
        <a
          href='/'
          className='px-6 py-3 bg-[var(--ai-primary)] text-white rounded-md hover:bg-[var(--ai-primary-hover)] transition-colors font-medium text-lg'
        >
          ホームに戻る
        </a>
      </div>
    </div>
  );
}
