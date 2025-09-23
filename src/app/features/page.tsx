import Link from 'next/link';
import { headers } from 'next/headers';
import { Card, CardContent } from '@/components/ui/card';
import {
  Search,
  Filter,
  Bookmark,
  TrendingUp,
  Globe,
  Clock,
} from 'lucide-react';
import type { Metadata } from 'next';
import { resolveAIAgentFromHost } from '@/config/ai-agents';
import { buildThemeStyle } from '@/lib/utils';

export const metadata: Metadata = {
  title: '機能紹介 - CC-Vault',
  description:
    'CC-VaultのClaudeCode関連記事を効率的に収集・キュレーションする機能をご紹介します。',
};

/**
 * 機能紹介ページコンポーネント
 */
export default async function FeaturesPage() {
  const requestHeaders = await headers();
  const host = requestHeaders?.get('host') ?? null;
  const aiAgent = resolveAIAgentFromHost({ host });
  const themeStyles = buildThemeStyle(aiAgent.colors);

  const features = [
    {
      icon: Search,
      title: '記事の自動収集',
      description:
        'Zenn、Qiitaなど複数のプラットフォームからClaudeCode関連記事を自動で収集します。',
    },
    {
      icon: Filter,
      title: 'サイト別フィルタリング',
      description:
        '特定のプラットフォームの記事のみを表示したり、全サイトを横断して閲覧できます。',
    },
    {
      icon: TrendingUp,
      title: 'トレンド表示',
      description:
        'エンゲージメント指標を基に人気記事をランキング形式で表示します。',
    },
    {
      icon: Clock,
      title: '新着順表示',
      description:
        '最新の投稿記事を時系列で確認でき、最新のトレンドをいち早くキャッチできます。',
    },
    {
      icon: Bookmark,
      title: 'エンゲージメント表示',
      description:
        'いいね数やブックマーク数を表示し、記事の人気度を一目で把握できます。',
    },
    {
      icon: Globe,
      title: 'レスポンシブデザイン',
      description:
        'PC・タブレット・スマートフォンなど、あらゆるデバイスで快適に利用できます。',
    },
  ];

  return (
    <div className='max-w-[80rem] mx-auto px-4 py-12' style={themeStyles}>
      {/* ページタイトル */}
      <div className='text-center mb-12'>
        <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--ai-text)] mb-6'>
          機能紹介
        </h1>
        <p className='text-lg text-[var(--ai-secondary)] max-w-2xl mx-auto'>
          CC-VaultはClaudeCode関連の技術記事を効率的に収集・キュレーションし、
          最新のトレンドや人気記事を一箇所で確認できるプラットフォームです。
        </p>
      </div>

      {/* 機能一覧 */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Card
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={index}
              className='ai-themed-bg ai-themed-border hover:shadow-lg transition-shadow duration-200'
            >
              <CardContent className='p-6'>
                <div className='flex items-center gap-4 mb-4'>
                  <div
                    className='p-3 rounded-lg'
                    style={{
                      backgroundColor:
                        'color-mix(in srgb, var(--ai-primary) 15%, transparent)',
                    }}
                  >
                    <IconComponent className='w-6 h-6 text-[var(--ai-primary)]' />
                  </div>
                  <h3 className='text-xl font-semibold text-[var(--ai-text)]'>
                    {feature.title}
                  </h3>
                </div>
                <p className='text-[var(--ai-text)] opacity-70 leading-relaxed'>
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* CTA セクション */}
      <div
        className='text-center rounded-lg p-12'
        style={{
          backgroundColor:
            'color-mix(in srgb, var(--ai-accent) 10%, transparent)',
        }}
      >
        <h2 className='text-3xl font-bold text-[var(--ai-text)] mb-6'>
          今すぐ始めましょう
        </h2>
        <p className='text-lg text-[var(--ai-secondary)] mb-8 max-w-xl mx-auto'>
          CC-VaultでClaudeCode関連の最新情報をキャッチアップし、技術トレンドを見逃すことなく学習を続けましょう。
        </p>
        <Link
          href='/'
          className='inline-flex items-center gap-2 px-8 py-3 text-lg font-medium text-white bg-[var(--ai-primary)] rounded-md hover:bg-[var(--ai-primary-hover)] transition-colors duration-200'
        >
          記事を見る
        </Link>
      </div>
    </div>
  );
}
