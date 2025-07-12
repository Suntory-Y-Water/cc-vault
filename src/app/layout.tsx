import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type React from 'react';
import './globals.css';
import { siteConfig } from './config/site';
import StructuredData from '@/components/common/StructuredData';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ja'>
      <body className={inter.className}>
        <StructuredData type='website' />
        <div className='min-h-screen flex flex-col bg-[#FAF9F5] text-[#141413]'>
          {/* 背景グラデーション */}
          <div className='absolute inset-0 -z-10 pointer-events-none bg-gradient-to-br from-[#141413]/5 via-transparent to-[#E0DFDA]/5' />
          <Header />
          <main className='flex-1'>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
