/**
 * AIエージェント設定システム
 * 静的設定によるマルチテナント・サブドメインルーティング機能
 */

import { headers } from 'next/headers';

export type AIAgent = {
  id: 'default' | 'claude-code' | 'codex';
  prefix: 'default' | 'cc' | 'cx';
  name: string;
  description: string;
  colors: {
    primary: string; // メインカラー (#DB8163)
    primaryHover: string; // ホバー時 (#C2754E)
    secondary: string; // セカンダリカラー (#7D4A38)
    accent: string; // アクセントカラー (border等)
    background: string; // 背景色 (#FAF9F5)
    text: string; // テキスト色 (#141413)
  };
  contentFilter: string[];
  branding: {
    siteName: string;
    favicon?: string;
    ogImage?: string;
  };
};

/**
 * AIエージェント設定の静的定義
 * 現在のClaude Code色設定を基準に他エージェント色を設定
 */
const AI_AGENT_CONFIGS: Record<AIAgent['prefix'], AIAgent> = {
  default: {
    id: 'default',
    prefix: 'default',
    name: 'CC-Vault',
    description: '技術記事のキュレーションと分析を行うWebアプリケーション',
    colors: {
      primary: '#DB8163', // 現在のClaude Code メインカラー
      primaryHover: '#C2754E', // 現在のClaude Code ホバー色
      secondary: '#7D4A38', // 現在のClaude Code セカンダリ
      accent: '#DB8163', // border色等
      background: '#FAF9F5', // カード背景色
      text: '#141413', // テキスト色
    },
    contentFilter: ['claude', 'anthropic', 'ai-coding'],
    branding: {
      siteName: 'CC-Vault',
      favicon: '/cc.svg',
      ogImage: '/opengraph-image.png',
    },
  },
  cc: {
    id: 'claude-code',
    prefix: 'cc',
    name: 'Claude Code',
    description: 'Claude Codeに関する技術記事とリソースのキュレーション',
    colors: {
      primary: '#DB8163', // 現在使用中の色
      primaryHover: '#C2754E', // 現在使用中のホバー色
      secondary: '#7D4A38', // 現在使用中のセカンダリ
      accent: '#DB8163', // border色
      background: '#FAF9F5', // カード背景色
      text: '#141413', // テキスト色
    },
    contentFilter: ['claude', 'anthropic', 'ai-coding'],
    branding: {
      siteName: 'CC-Vault',
    },
  },
  cx: {
    id: 'codex',
    name: 'Codex',
    prefix: 'cx',
    description: 'Codexに関する技術記事とリソースのキュレーション',
    colors: {
      primary: '#333333', // ベースカラー(ダークグレー)
      primaryHover: '#555555', // ホバー時の明るいグレー
      secondary: '#666666', // セカンダリカラー(ミディアムグレー)
      accent: '#333333', // border色等
      background: '#FAFAFA', // 背景色(白に近いライトグレー)
      text: '#1a1a1a', // テキスト色(濃いグレー)
    },
    contentFilter: ['codex', 'openai', 'code-generation'],
    branding: {
      siteName: 'CX-Vault',
      favicon: '/cx.svg',
      ogImage: '/codex-opengraph-image.png',
    },
  },
};

/**
 * セキュリティ定数
 */
const SECURITY_CONSTANTS = {
  MAX_HOSTNAME_LENGTH: 253,
  MAX_SUBDOMAIN_LENGTH: 63,
  VALID_HOSTNAME_CHARS: /^[a-zA-Z0-9.\-:]+$/,
  VALID_SUBDOMAIN_PATTERN: /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/,
  MALICIOUS_PATTERNS: [
    /javascript:/i,
    /data:/i,
    /<[^>]*>/, // HTMLタグ
    /['";]/, // SQL注入攻撃の可能性
    /\.\./, // パストラバーサル
    /[\\]/, // バックスラッシュ
  ],
} as const;

/**
 * ホスト名をサニタイズする（セキュリティ対策）
 */
function sanitizeHostname(host: string): string {
  // 英数字、ハイフン、ピリオド、コロン（ポート番号用）のみ許可
  return host.replace(/[^a-zA-Z0-9.\-:]/g, '');
}

/**
 * ホスト名を検証する（セキュリティ対策）
 */
function isValidHostname(host: string): boolean {
  // 長すぎるホスト名を拒否
  if (host.length > SECURITY_CONSTANTS.MAX_HOSTNAME_LENGTH) return false;

  // 不正なパターンを検出
  return !SECURITY_CONSTANTS.MALICIOUS_PATTERNS.some((pattern) =>
    pattern.test(host),
  );
}

/**
 * サブドメインが有効かどうかを検証する
 */
function isValidSubdomain(subdomain: string): boolean {
  // サブドメインの基本的な検証
  if (
    !subdomain ||
    subdomain.length === 0 ||
    subdomain.length > SECURITY_CONSTANTS.MAX_SUBDOMAIN_LENGTH
  ) {
    return false;
  }

  // RFC準拠のサブドメイン検証（英数字とハイフン、先頭末尾はハイフン不可）
  return SECURITY_CONSTANTS.VALID_SUBDOMAIN_PATTERN.test(subdomain);
}

/**
 * ホスト名からサブドメインを抽出する関数
 * ローカル開発環境（*.localhost）と本番環境の両方に対応
 */
function extractSubdomain(host: string | null): string | null {
  if (!host) return null;

  // セキュリティ検証
  if (!isValidHostname(host)) return null;

  // ホスト名をサニタイズ
  const sanitizedHost = sanitizeHostname(host);

  // ポート番号を除去
  const hostWithoutPort = sanitizedHost.split(':')[0];

  return getSubdomain(hostWithoutPort);
}

/**
 * サブドメインを抽出する関数
 * ローカル開発環境と本番環境の両方に対応
 */
function getSubdomain(hostRaw: string): string | null {
  const BASE = process.env.NEXT_PUBLIC_BASE_DOMAIN ?? 'agents-vault.com';

  const host = hostRaw.split(':')[0];

  // ローカル開発環境での対応
  if (host === 'localhost') return null;
  if (host.endsWith('.localhost')) {
    const subdomain = host.slice(0, -'.localhost'.length);
    return isValidSubdomain(subdomain) ? subdomain : null;
  }

  // 本番環境での対応
  if (host.endsWith('.' + BASE)) {
    const subdomain = host.slice(0, -('.' + BASE).length);
    return isValidSubdomain(subdomain) ? subdomain : null;
  }

  return null;
}

/**
 * ホスト名からAIエージェント設定を解決する
 * セキュリティ要件: ホスト名検証とサニタイゼーションを実行
 * フォールバック戦略: 未知/無効なサブドメインはデフォルトエージェントへ
 */
export function resolveAIAgentFromHost(args: { host: string | null }): AIAgent {
  const subdomain = extractSubdomain(args.host);

  // サブドメインがない場合はデフォルト
  if (!subdomain) {
    return AI_AGENT_CONFIGS.default;
  }

  // 既知のAIエージェントIDかチェック
  if (subdomain in AI_AGENT_CONFIGS) {
    return AI_AGENT_CONFIGS[subdomain as AIAgent['prefix']];
  }

  // 未知のサブドメインはデフォルトにフォールバック
  return AI_AGENT_CONFIGS.default;
}

/**
 * リクエストヘッダーからAIエージェント情報を取得するヘルパー関数
 */
export async function getAIAgentFromHeaders(): Promise<AIAgent> {
  const requestHeaders = await headers();
  const host = requestHeaders?.get('host') ?? null;
  return resolveAIAgentFromHost({ host });
}

/**
 * AIエージェントIDから設定を取得する
 */
export function getAIAgentConfig(args: { agentId: string }): AIAgent {
  if (args.agentId in AI_AGENT_CONFIGS) {
    return AI_AGENT_CONFIGS[args.agentId as AIAgent['prefix']];
  }

  // 未知のIDはデフォルトを返す
  return AI_AGENT_CONFIGS.default;
}
