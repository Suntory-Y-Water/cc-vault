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
 * ホスト名からサブドメインを抽出する
 */
function extractSubdomain(host: string | null): string | null {
  if (!host) return null;

  // ローカル開発環境の場合
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    return null;
  }

  // サブドメインを抽出
  const parts = host.split('.');
  if (parts.length < 3) return null;

  return parts[0];
}

/**
 * ホスト名からAIエージェント設定を解決する
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
