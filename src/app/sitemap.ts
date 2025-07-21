import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

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
  return [...routes];
}
