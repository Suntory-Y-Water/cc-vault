import { MetadataRoute } from 'next';
import { siteConfig } from './config/site';

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
    {
      url: `${siteConfig.url}/weekly-report`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // 動的ルートの追加
  const dynamicRoutes = [];

  // 新着・トレンド × サイトフィルター の組み合わせ
  const orders = ['latest', 'trending'];
  const sites = ['all', 'hatena', 'qiita', 'zenn', 'note', 'docs'];

  for (const order of orders) {
    for (const site of sites) {
      dynamicRoutes.push({
        url: `${siteConfig.url}/?order=${order}&site=${site}`,
        lastModified: new Date(),
        changeFrequency: 'hourly' as const,
        priority: 0.7,
      });
    }
  }

  return [...routes, ...dynamicRoutes];
}
