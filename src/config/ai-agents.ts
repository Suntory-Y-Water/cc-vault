/**
 * AIエージェント設定システム
 * 静的設定によるマルチテナント・サブドメインルーティング機能
 */

export type AIAgent = {
  id: 'default' | 'claude-code' | 'codex';
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
    tagline?: string;
  };
};

/**
 * AIエージェント設定の静的定義
 * 現在のClaude Code色設定を基準に他エージェント色を設定
 */
const AI_AGENT_CONFIGS: Record<AIAgent['id'], AIAgent> = {
  default: {
    id: 'default',
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
    contentFilter: [],
    branding: {
      siteName: 'CC-Vault',
      tagline: '技術記事のキュレーション',
    },
  },
  'claude-code': {
    id: 'claude-code',
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
      siteName: 'Claude Code Hub',
      tagline: 'AIアシスタントコーディングの最前線',
    },
  },
  codex: {
    id: 'codex',
    name: 'Codex',
    description: 'OpenAI Codexとコード生成AIに関する技術情報',
    colors: {
      primary: '#10b981', // エメラルドグリーン系
      primaryHover: '#059669', // より濃いグリーン
      secondary: '#065f46', // ダークグリーン
      accent: '#10b981', // border色
      background: '#f0fdf4', // 薄いグリーン背景
      text: '#141413', // 統一テキスト色
    },
    contentFilter: ['codex', 'openai', 'code-generation'],
    branding: {
      siteName: 'Codex Central',
      tagline: 'コード生成AIの専門情報',
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
    /<[^>]*>/,  // HTMLタグ
    /['";]/,    // SQL注入攻撃の可能性
    /\.\./,     // パストラバーサル
    /[\\]/      // バックスラッシュ
  ]
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
  return !SECURITY_CONSTANTS.MALICIOUS_PATTERNS.some(pattern => pattern.test(host));
}

/**
 * サブドメインが有効かどうかを検証する
 */
function isValidSubdomain(subdomain: string): boolean {
  // サブドメインの基本的な検証
  if (!subdomain || subdomain.length === 0 || subdomain.length > SECURITY_CONSTANTS.MAX_SUBDOMAIN_LENGTH) {
    return false;
  }

  // RFC準拠のサブドメイン検証（英数字とハイフン、先頭末尾はハイフン不可）
  return SECURITY_CONSTANTS.VALID_SUBDOMAIN_PATTERN.test(subdomain);
}

/**
 * ホスト名からサブドメインを抽出する
 */
function extractSubdomain(host: string | null): string | null {
  if (!host) return null;

  // セキュリティ検証
  if (!isValidHostname(host)) return null;

  // ホスト名をサニタイズ
  const sanitizedHost = sanitizeHostname(host);

  // ローカル開発環境の場合
  if (sanitizedHost.includes('localhost') || sanitizedHost.includes('127.0.0.1')) {
    return null;
  }

  // ポート番号を除去
  const hostWithoutPort = sanitizedHost.split(':')[0];

  // サブドメインを抽出
  const parts = hostWithoutPort.split('.');
  if (parts.length < 3) return null;

  const subdomain = parts[0];

  // サブドメインの追加検証
  if (!isValidSubdomain(subdomain)) {
    return null;
  }

  return subdomain;
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
    return AI_AGENT_CONFIGS[subdomain as AIAgent['id']];
  }

  // 未知のサブドメインはデフォルトにフォールバック
  return AI_AGENT_CONFIGS.default;
}

/**
 * AIエージェントIDから設定を取得する
 */
export function getAIAgentConfig(args: { agentId: string }): AIAgent {
  if (args.agentId in AI_AGENT_CONFIGS) {
    return AI_AGENT_CONFIGS[args.agentId as AIAgent['id']];
  }

  // 未知のIDはデフォルトを返す
  return AI_AGENT_CONFIGS.default;
}
