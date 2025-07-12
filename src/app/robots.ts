import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

/**
 * robots.txt生成
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/admin/'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
