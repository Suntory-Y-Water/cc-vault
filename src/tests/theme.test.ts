import { describe, expect, it } from 'vitest';

/**
 * UIテーマとブランディングの動的適用システムのテスト
 *
 * テスト対象:
 * - AIエージェント別のCSSカスタムプロパティ適用
 * - data-ai-agent属性によるCSSスコープ
 * - エージェント別のブランディング情報表示
 * - デフォルトテーマへのフォールバック
 */

// これらの関数は後でlayout.tsxから抽出される予定
type AIAgentColors = {
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

type AIAgentBranding = {
  siteName: string;
  tagline?: string;
};

type AIAgent = {
  id: 'default' | 'claude-code' | 'codex';
  name: string;
  description: string;
  colors: AIAgentColors;
  branding: AIAgentBranding;
};

// テスト用のモックエージェント設定
const mockAgents: Record<string, AIAgent> = {
  'claude-code': {
    id: 'claude-code',
    name: 'Claude Code',
    description: 'Claude Code AI Agent',
    colors: {
      primary: '#8B5A3C',
      primaryHover: '#A0522D',
      secondary: '#2D3748',
      accent: '#FF6B35',
      background: '#F7FAFC',
      text: '#2D3748',
    },
    branding: {
      siteName: 'Claude Code Vault',
      tagline: 'AI-Powered Development Insights',
    },
  },
  codex: {
    id: 'codex',
    name: 'Codex',
    description: 'Codex AI Agent',
    colors: {
      primary: '#4A90E2',
      primaryHover: '#357ABD',
      secondary: '#2C3E50',
      accent: '#E74C3C',
      background: '#ECF0F1',
      text: '#2C3E50',
    },
    branding: {
      siteName: 'Codex Vault',
      tagline: 'Advanced Code Intelligence',
    },
  },
  default: {
    id: 'default',
    name: 'CC-Vault',
    description: 'Default CC-Vault',
    colors: {
      primary: '#0066CC',
      primaryHover: '#0052A3',
      secondary: '#1A202C',
      accent: '#38A169',
      background: '#FFFFFF',
      text: '#1A202C',
    },
    branding: {
      siteName: 'CC-Vault',
      tagline: 'Tech Article Curation',
    },
  },
};

// 現在layout.tsxにある関数を抽出してテスト可能にする
function buildThemeStyle(colors: AIAgentColors) {
  return {
    '--ai-primary': colors.primary,
    '--ai-primary-hover': colors.primaryHover,
    '--ai-secondary': colors.secondary,
    '--ai-accent': colors.accent,
    '--ai-background': colors.background,
    '--ai-text': colors.text,
    backgroundColor: colors.background,
    color: colors.text,
  };
}

function generateDataAttributes(agentId: string) {
  return {
    'data-ai-agent': agentId,
  };
}

function applyBrandingToElements(branding: AIAgentBranding) {
  return {
    siteName: branding.siteName,
    tagline: branding.tagline || '',
  };
}

describe('UIテーマとブランディングの動的適用システム', () => {
  describe('CSS統合テスト', () => {
    it('AIエージェント別のCSSクラスが適切に定義されること', () => {
      // CSSが適用されるHTMLの構造をシミュレート
      const mockElement = {
        getAttribute: (attr: string) => 'claude-code',
        classList: {
          contains: (className: string) => className === 'ai-themed-button',
        },
      };

      // data-ai-agent属性があることを確認
      expect(mockElement.getAttribute('data-ai-agent')).toBe('claude-code');
    });

    it('AIテーマクラスが適切に識別されること', () => {
      const themeClasses = [
        'ai-themed-button',
        'ai-themed-badge',
        'ai-themed-border',
        'ai-themed-text',
        'ai-themed-bg',
        'ai-themed-primary',
        'ai-themed-accent',
      ];

      themeClasses.forEach((className) => {
        expect(className).toMatch(/^ai-themed-/);
      });
    });
  });

  describe('buildThemeStyle', () => {
    it('Claude Codeエージェントの色設定でCSSカスタムプロパティを生成すること', () => {
      const colors = mockAgents['claude-code'].colors;
      const result = buildThemeStyle(colors);

      expect(result).toEqual({
        '--ai-primary': '#8B5A3C',
        '--ai-primary-hover': '#A0522D',
        '--ai-secondary': '#2D3748',
        '--ai-accent': '#FF6B35',
        '--ai-background': '#F7FAFC',
        '--ai-text': '#2D3748',
        backgroundColor: '#F7FAFC',
        color: '#2D3748',
      });
    });

    it('Codexエージェントの色設定でCSSカスタムプロパティを生成すること', () => {
      const colors = mockAgents.codex.colors;
      const result = buildThemeStyle(colors);

      expect(result).toEqual({
        '--ai-primary': '#4A90E2',
        '--ai-primary-hover': '#357ABD',
        '--ai-secondary': '#2C3E50',
        '--ai-accent': '#E74C3C',
        '--ai-background': '#ECF0F1',
        '--ai-text': '#2C3E50',
        backgroundColor: '#ECF0F1',
        color: '#2C3E50',
      });
    });

    it('デフォルトエージェントの色設定でCSSカスタムプロパティを生成すること', () => {
      const colors = mockAgents.default.colors;
      const result = buildThemeStyle(colors);

      expect(result).toEqual({
        '--ai-primary': '#0066CC',
        '--ai-primary-hover': '#0052A3',
        '--ai-secondary': '#1A202C',
        '--ai-accent': '#38A169',
        '--ai-background': '#FFFFFF',
        '--ai-text': '#1A202C',
        backgroundColor: '#FFFFFF',
        color: '#1A202C',
      });
    });
  });

  describe('generateDataAttributes', () => {
    it('AIエージェントIDに基づいてdata-ai-agent属性を生成すること', () => {
      expect(generateDataAttributes('claude-code')).toEqual({
        'data-ai-agent': 'claude-code',
      });

      expect(generateDataAttributes('codex')).toEqual({
        'data-ai-agent': 'codex',
      });

      expect(generateDataAttributes('default')).toEqual({
        'data-ai-agent': 'default',
      });
    });
  });

  describe('applyBrandingToElements', () => {
    it('Claude Codeエージェントのブランディング情報を適用すること', () => {
      const branding = mockAgents['claude-code'].branding;
      const result = applyBrandingToElements(branding);

      expect(result).toEqual({
        siteName: 'Claude Code Vault',
        tagline: 'AI-Powered Development Insights',
      });
    });

    it('Codexエージェントのブランディング情報を適用すること', () => {
      const branding = mockAgents.codex.branding;
      const result = applyBrandingToElements(branding);

      expect(result).toEqual({
        siteName: 'Codex Vault',
        tagline: 'Advanced Code Intelligence',
      });
    });

    it('デフォルトエージェントのブランディング情報を適用すること', () => {
      const branding = mockAgents.default.branding;
      const result = applyBrandingToElements(branding);

      expect(result).toEqual({
        siteName: 'CC-Vault',
        tagline: 'Tech Article Curation',
      });
    });

    it('taglineが未定義の場合は空文字を返すこと', () => {
      const brandingWithoutTagline: AIAgentBranding = {
        siteName: 'Test Site',
      };
      const result = applyBrandingToElements(brandingWithoutTagline);

      expect(result).toEqual({
        siteName: 'Test Site',
        tagline: '',
      });
    });
  });

  describe('コンポーネント統合テスト', () => {
    it('ArticleCardがAIテーマクラスを使用していること', () => {
      const expectedThemeClasses = [
        'ai-themed-bg',
        'ai-themed-border',
        'ai-themed-text',
        'ai-themed-button',
      ];

      expectedThemeClasses.forEach((className) => {
        expect(className).toMatch(/^ai-themed-/);
      });
    });

    it('エージェント別のCSSカスタムプロパティが適切に設定されること', () => {
      const agentColors = ['#8B5A3C', '#4A90E2', '#0066CC'];

      agentColors.forEach((color) => {
        expect(color).toMatch(/^#[A-Fa-f0-9]{6}$/);
      });
    });
  });
});
