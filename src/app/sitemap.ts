import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { SORT_ORDERS, SITE_NAMES } from '@/types/article';

/**
 * サイトマップ生成
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 1,
    },
  ];

  // 動的ルートの追加
  const dynamicRoutes = [];

  // 新着・トレンド × サイトフィルター の組み合わせ
  for (const order of Object.values(SORT_ORDERS)) {
    for (const site of Object.values(SITE_NAMES)) {
      dynamicRoutes.push({
        url: `${siteConfig.url}/?order=${order}&amp;site=${site}`,
        lastModified: new Date(),
        changeFrequency: 'hourly' as const,
        priority: 0.7,
      });
    }
  }

  return [...routes, ...dynamicRoutes];
}
