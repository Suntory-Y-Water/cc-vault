/**
 * 汎用fetch関数
 */

import type { FetchOptions } from '@/types';

/**
 * 汎用fetch関数 - 外部APIからデータを取得
 * @param url - リクエストURL
 * @param options - fetch オプション
 * @returns Promise<T> - レスポンスデータ
 */
export async function fetchExternalData<T>(
  url: string,
  options?: RequestInit & FetchOptions,
): Promise<T> {
  const {
    cache = 'no-store',
    revalidate = 3600,
    tags = [],
    ...fetchOptions
  } = options || {};

  try {
    const response = await fetch(url, {
      cache,
      next: {
        revalidate,
        tags,
      },
      ...fetchOptions,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
