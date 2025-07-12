import { siteConfig } from '@/app/config/site';
import type { Article } from '@/types';

type StructuredDataProps = {
  type: 'website' | 'article' | 'breadcrumb';
  article?: Article;
  breadcrumbs?: Array<{ name: string; url: string }>;
};

type WebsiteStructuredData = {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  potentialAction: {
    '@type': string;
    target: string;
    'query-input': string;
  };
  author: {
    '@type': string;
    name: string;
  };
  sameAs: string[];
};

type ArticleStructuredData = {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  author: {
    '@type': string;
    name: string;
  };
  publisher: {
    '@type': string;
    name: string;
    logo: {
      '@type': string;
      url: string;
    };
  };
  mainEntityOfPage: {
    '@type': string;
    '@id': string;
  };
  interactionStatistic: Array<{
    '@type': string;
    interactionType: string;
    userInteractionCount: number;
  }>;
};

type BreadcrumbStructuredData = {
  '@context': string;
  '@type': string;
  itemListElement: Array<{
    '@type': string;
    position: number;
    name: string;
    item: string;
  }>;
};

/**
 * 構造化データコンポーネント
 * JSON-LDを生成してSEO対策を行う
 */
export default function StructuredData({
  type,
  article,
  breadcrumbs,
}: StructuredDataProps) {
  const generateWebsiteStructuredData = (): WebsiteStructuredData => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    author: {
      '@type': 'Organization',
      name: siteConfig.copyRight,
    },
    sameAs: [siteConfig.links.twitter, siteConfig.links.github],
  });

  const generateArticleStructuredData = (): ArticleStructuredData | null => {
    if (!article) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.title,
      url: article.url,
      datePublished: article.publishedAt,
      dateModified: article.publishedAt,
      author: {
        '@type': 'Person',
        name: article.author,
      },
      publisher: {
        '@type': 'Organization',
        name: siteConfig.name,
        logo: {
          '@type': 'ImageObject',
          url: siteConfig.ogImage,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': article.url,
      },
      interactionStatistic: [
        {
          '@type': 'InteractionCounter',
          interactionType: 'https://schema.org/LikeAction',
          userInteractionCount: article.engagement.likes,
        },
        {
          '@type': 'InteractionCounter',
          interactionType: 'https://schema.org/BookmarkAction',
          userInteractionCount: article.engagement.bookmarks,
        },
      ],
    };
  };

  const generateBreadcrumbStructuredData =
    (): BreadcrumbStructuredData | null => {
      if (!breadcrumbs) return null;

      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: crumb.url,
        })),
      };
    };

  let structuredData:
    | WebsiteStructuredData
    | ArticleStructuredData
    | BreadcrumbStructuredData
    | null;

  switch (type) {
    case 'website':
      structuredData = generateWebsiteStructuredData();
      break;
    case 'article':
      structuredData = generateArticleStructuredData();
      break;
    case 'breadcrumb':
      structuredData = generateBreadcrumbStructuredData();
      break;
    default:
      return null;
  }

  if (!structuredData) return null;

  return (
    <script
      type='application/ld+json'
      // biome-ignore lint/security/noDangerouslySetInnerHtml: 構造化データのJSON-LD出力のため必要
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
