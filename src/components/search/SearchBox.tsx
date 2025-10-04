'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Input } from '@/components/ui/input';
import type { AIAgent } from '@/config/ai-agents';
import { buildThemeStyle } from '@/lib/utils';

type SearchBoxProps = {
  aiAgent: Pick<AIAgent, 'colors'>;
};

type SearchThemeVariables = CSSProperties &
  Record<'--search-ring-color' | '--search-ring-offset', string>;

/**
 * 検索ボックスコンポーネント
 *
 * 事前条件:
 * - Next.js App Routerの環境で使用されること
 * - クライアントサイドコンポーネントとして動作すること
 *
 * 事後条件:
 * - 検索実行時に適切な検索URLに遷移すること
 * - 空文字列の検索は実行しないこと
 */
export default function SearchBox({ aiAgent }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { colors } = aiAgent;
  const themeVariables: SearchThemeVariables = {
    ...buildThemeStyle(colors),
    '--search-ring-color': colors.primary,
    '--search-ring-offset': colors.background,
  };

  /**
   * 検索を実行する関数
   *
   * 事前条件:
   * - queryが文字列であること
   *
   * 事後条件:
   * - 有効なクエリの場合、検索ページに遷移すること
   * - 無効なクエリの場合、何もしないこと
   */
  function handleSearch() {
    // 事前条件チェック
    const trimmedQuery = query.trim();

    // 空文字チェック
    if (trimmedQuery === '') {
      return;
    }

    // 最大文字数チェック（URL長制限対応）
    if (trimmedQuery.length > 100) {
      return;
    }

    // 検索ページに遷移
    const searchUrl = `/search?q=${encodeURIComponent(trimmedQuery)}`;
    router.push(searchUrl);
    setQuery('');

    // 事後条件チェック
    if (!searchUrl.startsWith('/search?q=')) {
      throw new Error('生成したURLが無効です');
    }
  }

  /**
   * キーボードイベントハンドラ
   */
  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }

  return (
    <div
      className='relative w-full sm:w-auto sm:max-w-md'
      style={themeVariables}
    >
      <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
      <Input
        type='text'
        placeholder='記事を検索...'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className='ai-themed-input w-full sm:min-w-[250px] pl-10 focus-visible:ring-[var(--search-ring-color)] focus-visible:ring-offset-[var(--search-ring-offset)]'
        maxLength={100}
      />
    </div>
  );
}
