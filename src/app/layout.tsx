import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Inter } from 'next/font/google';
import type { CSSProperties, ReactNode } from 'react';
import './globals.css';
import StructuredData from '@/components/common/StructuredData';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { resolveAIAgentFromHost } from '@/config/ai-agents';
import { siteConfig } from '@/config/site';
import { buildThemeStyle } from '@/lib/utils';
import { getCloudflareContext } from '@opennextjs/cloudflare';

const inter = Inter({ subsets: ['latin'] });

/**
 * サブドメインごとの動的メタデータ生成
 */
export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders?.get('host') ?? null;
  const aiAgent = resolveAIAgentFromHost({ host });

  const siteName = aiAgent.branding.siteName;
  const description = aiAgent.description;
  const favicon = aiAgent.branding.favicon ?? '/favicon.ico';
  const ogImage = aiAgent.branding.ogImage ?? siteConfig.ogImage;

  // 動的にベースURLを構築（優先順位: host header > Cloudflare env > 固定値）
  const { env } = await getCloudflareContext();
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const baseUrl = host ? `${protocol}://${host}` : env.APP_URL;

  return {
    title: {
      default: siteName,
      template: `%s - ${siteName}`,
    },
    description,
    keywords: [
      'Claude Code',
      'Claude',
      'Anthropic',
      'AI',
      'プログラミング',
      'コード生成',
      'キュレーション',
      'Qiita',
      'Zenn',
      'Codex',
    ],
    authors: [{ name: siteConfig.copyRight }],
    creator: siteConfig.copyRight,
    metadataBase: new URL(baseUrl),
    icons: {
      icon: favicon,
    },
    openGraph: {
      type: 'website',
      locale: 'ja_JP',
      url: baseUrl,
      title: siteName,
      description,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description,
      images: [ogImage],
      creator: '@Suntory_N_Water',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

const shellStyle: CSSProperties = {
  backgroundColor: 'var(--ai-background)',
  color: 'var(--ai-text)',
};

const gradientStyle: CSSProperties = {
  background:
    'linear-gradient(to bottom right, color-mix(in srgb, var(--ai-text) 5%, transparent), transparent, color-mix(in srgb, var(--ai-accent) 5%, transparent))',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const requestHeaders = await headers();
  const host = requestHeaders?.get('host') ?? null;
  const aiAgent = resolveAIAgentFromHost({ host });
  const themeStyle = buildThemeStyle(aiAgent.colors);

  return (
    <html lang='ja' data-ai-agent={aiAgent.id}>
      <body
        className={inter.className}
        data-ai-agent={aiAgent.id}
        style={themeStyle}
      >
        <StructuredData type='website' />
        <div
          className='min-h-screen flex flex-col'
          data-ai-theme='shell'
          style={shellStyle}
        >
          {/* 背景グラデーション */}
          <div
            className='absolute inset-0 -z-10 pointer-events-none'
            aria-hidden
            style={gradientStyle}
          />
          <Header aiAgent={aiAgent} />
          <main className='flex-1'>{children}</main>
          <Footer aiAgent={aiAgent} />
        </div>
      </body>
    </html>
  );
}
