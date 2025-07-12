/**
 * 汎用fetch関数
 */

import type { FetchOptions } from '@/types';
import { JSDOM } from 'jsdom';

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
    cache = 'default',
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

/**
 * HTMLページを取得してDocumentオブジェクトを返す
 * @param url - ページURL
 * @param options - fetch オプション
 * @returns Promise<Document> - パース済みのHTMLドキュメント
 */
export async function fetchHtmlDocument(
  url: string,
  options?: RequestInit & FetchOptions,
): Promise<Document> {
  const {
    cache = 'default',
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
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...fetchOptions.headers,
      },
      ...fetchOptions,
    });

    if (!response.ok) {
      throw new Error(
        `HTML fetch error: ${response.status} ${response.statusText}`,
      );
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    return dom.window.document;
  } catch (error) {
    console.error('HTML fetch error:', error);
    throw error;
  }
}
