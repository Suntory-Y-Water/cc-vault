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

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
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
  ],
  authors: [{ name: siteConfig.copyRight }],
  creator: siteConfig.copyRight,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
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
          <Header branding={aiAgent.branding} />
          <main className='flex-1'>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
