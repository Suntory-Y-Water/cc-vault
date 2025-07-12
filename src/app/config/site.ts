/**
 * サイト設定の型定義とサイト固有の設定値
 */

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
  };
  repository?: {
    branch?: string;
  };
  copyRight: string;
  // メールアドレスは使うときになったら乗せる
  email?: string;
};

// TODO: URL
const url = process.env.APP_URL || 'https://cc-valut.com';

/**
 * CC-Vaultサイト設定
 */
export const siteConfig: SiteConfig = {
  name: 'CC-Vault',
  description:
    'Claude Codeに特化した情報提供プラットフォーム。複数の記事プラットフォームからClaude Code関連記事を収集・分析し、トレンドや人気記事をキュレーションして提供します。',
  url: url,
  ogImage: `${url}/opengraph-image.png`,
  links: {
    twitter: 'https://x.com/Suntory_N_Water',
    github: 'https://github.com/Suntory-Y-Water/cc-vault',
  },
  repository: {
    branch: 'main',
  },
  copyRight: 'CC-Vault',
};

/**
 * ページ別メタデータ設定
 */
export const pageMetadata = {
  home: {
    title: 'CC-Vault - Claude Code記事キュレーションプラットフォーム',
    description:
      'Claude Codeに関する最新記事やトレンドをはてなブックマーク、Qiita、Zennから収集・キュレーション。開発者向けの情報を一箇所で効率的に取得できます。',
  },
  weeklyReport: {
    title: 'ウィークリーレポート - CC-Vault',
    description:
      'Claude Codeに関する週間人気記事トップ10とAI生成による要約レポート。開発トレンドを効率的に把握できます。',
  },
  trending: {
    title: 'トレンド記事 - CC-Vault',
    description:
      'Claude Codeに関する話題の記事をトレンド順で表示。人気記事やバズった記事を見逃さずチェックできます。',
  },
  latest: {
    title: '最新記事 - CC-Vault',
    description:
      'Claude Codeに関する最新記事を新着順で表示。常に最新の情報をキャッチアップできます。',
  },
} as const;

/**
 * サイト別フィルターメタデータ
 */
export const siteFilterMetadata = {
  all: {
    title: '全サイト',
    description: 'Qiita、Zenn、からClaude Code関連記事を収集',
  },
  hatena: {
    title: 'はてなブックマーク',
    description: 'はてなブックマークからClaude Code関連記事を収集',
  },
  qiita: {
    title: 'Qiita',
    description: 'QiitaからClaude Code関連記事を収集',
  },
  zenn: {
    title: 'Zenn',
    description: 'ZennからClaude Code関連記事を収集',
  },
  note: {
    title: 'note',
    description: 'noteからClaude Code関連記事を収集',
  },
  docs: {
    title: '公式ドキュメント',
    description: 'Claude Code公式ドキュメントを収集',
  },
} as const;
