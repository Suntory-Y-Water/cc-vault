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

// TODO: こういったときの設定どうするか、CloudflareがENVで環境ごとにURL変える場合のアクセス法
const url = process.env.APP_URL || 'https://cc-vault.ayasnppk00.workers.dev';

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
