import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type React from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CC-Vault',
  description:
    'Claude Code に関する記事を複数のプラットフォームから収集・キュレーション',
  keywords: [
    'Claude Code',
    'Claude',
    'Anthropic',
    'AI',
    'プログラミング',
    'コード生成',
  ],
  authors: [{ name: 'CC-Vault' }],
  openGraph: {
    title: 'CC-Vault',
    description: 'Claude Code メディアアグリゲーションプラットフォーム',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ja'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
