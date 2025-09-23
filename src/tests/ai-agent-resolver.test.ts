/**
 * AIエージェント解決システムのテストケース
 * タスク1.3: ホスト名ベースのテナント解決システムのテスト
 */

import { describe, it, expect } from 'vitest';
import {
  resolveAIAgentFromHost,
  getAIAgentConfig,
  type AIAgent,
} from '../config/ai-agents';

describe('AIエージェント解決システム', () => {
  describe('resolveAIAgentFromHost', () => {
    it('有効なサブドメインの場合、対応するAIエージェント設定を返すべき', () => {
      // Claude Code サブドメインのテスト
      const claudeCodeAgent = resolveAIAgentFromHost({
        host: 'claude-code.example.com',
      });
      expect(claudeCodeAgent.id).toBe('claude-code');
      expect(claudeCodeAgent.name).toBe('Claude Code');
      expect(claudeCodeAgent.branding.siteName).toBe('Claude Code Hub');

      // Codex サブドメインのテスト
      const codexAgent = resolveAIAgentFromHost({ host: 'codex.example.com' });
      expect(codexAgent.id).toBe('codex');
      expect(codexAgent.name).toBe('Codex');
      expect(codexAgent.branding.siteName).toBe('Codex Central');
    });

    it('未知のサブドメインの場合、デフォルトエージェントを返すべき', () => {
      const unknownAgent = resolveAIAgentFromHost({
        host: 'unknown.example.com',
      });
      expect(unknownAgent.id).toBe('default');
      expect(unknownAgent.name).toBe('CC-Vault');
    });

    it('サブドメインなしのホスト名の場合、デフォルトエージェントを返すべき', () => {
      const directAgent = resolveAIAgentFromHost({ host: 'example.com' });
      expect(directAgent.id).toBe('default');
    });

    it('nullまたは空のホスト名の場合、デフォルトエージェントを返すべき', () => {
      const nullAgent = resolveAIAgentFromHost({ host: null });
      expect(nullAgent.id).toBe('default');

      const emptyAgent = resolveAIAgentFromHost({ host: '' });
      expect(emptyAgent.id).toBe('default');
    });

    it('ローカル開発環境の場合、デフォルトエージェントを返すべき', () => {
      const localhostAgent = resolveAIAgentFromHost({ host: 'localhost:3000' });
      expect(localhostAgent.id).toBe('default');

      const ipAgent = resolveAIAgentFromHost({ host: '127.0.0.1:3000' });
      expect(ipAgent.id).toBe('default');
    });

    it('ホスト名検証とサニタイゼーションが適切に動作すべき', () => {
      // 不正な文字を含むホスト名
      const maliciousAgent = resolveAIAgentFromHost({
        host: 'claude-code.<script>alert(1)</script>.com',
      });
      expect(maliciousAgent.id).toBe('default');

      // 非常に長いホスト名
      const longHostname = 'a'.repeat(1000) + '.example.com';
      const longHostAgent = resolveAIAgentFromHost({ host: longHostname });
      expect(longHostAgent.id).toBe('default');
    });

    it('ポート番号が含まれるホスト名でも正しく動作すべき', () => {
      const portAgent = resolveAIAgentFromHost({
        host: 'claude-code.example.com:8080',
      });
      expect(portAgent.id).toBe('claude-code');
    });
  });

  describe('getAIAgentConfig', () => {
    it('有効なエージェントIDの場合、対応する設定を返すべき', () => {
      const claudeConfig = getAIAgentConfig({ agentId: 'claude-code' });
      expect(claudeConfig.id).toBe('claude-code');
      expect(claudeConfig.contentFilter).toContain('claude');

      const codexConfig = getAIAgentConfig({ agentId: 'codex' });
      expect(codexConfig.id).toBe('codex');
      expect(codexConfig.contentFilter).toContain('codex');
    });

    it('無効なエージェントIDの場合、デフォルト設定を返すべき', () => {
      const invalidConfig = getAIAgentConfig({ agentId: 'invalid-agent' });
      expect(invalidConfig.id).toBe('default');
    });

    it('すべてのエージェント設定が必要なプロパティを持つべき', () => {
      const agents: AIAgent['id'][] = ['default', 'claude-code', 'codex'];

      agents.forEach((agentId) => {
        const config = getAIAgentConfig({ agentId });

        // 基本プロパティの確認
        expect(config.id).toBe(agentId);
        expect(config.name).toBeTruthy();
        expect(config.description).toBeTruthy();

        // 色設定の確認
        expect(config.colors.primary).toMatch(/^#[0-9a-f]{6}$/i);
        expect(config.colors.primaryHover).toMatch(/^#[0-9a-f]{6}$/i);
        expect(config.colors.secondary).toMatch(/^#[0-9a-f]{6}$/i);
        expect(config.colors.background).toMatch(/^#[0-9a-f]{6}$/i);
        expect(config.colors.text).toMatch(/^#[0-9a-f]{6}$/i);

        // ブランディング設定の確認
        expect(config.branding.siteName).toBeTruthy();
        expect(Array.isArray(config.contentFilter)).toBe(true);
      });
    });
  });

  describe('セキュリティ要件', () => {
    it('XSS攻撃を含むホスト名に対して安全に動作すべき', () => {
      const xssHosts = [
        'javascript:alert(1).example.com',
        'data:text/html,<script>alert(1)</script>.example.com',
        '<img src=x onerror=alert(1)>.example.com',
      ];

      xssHosts.forEach((host) => {
        const agent = resolveAIAgentFromHost({ host });
        expect(agent.id).toBe('default');
      });
    });

    it('SQLインジェクション攻撃を含むホスト名に対して安全に動作すべき', () => {
      const sqlInjectionHosts = [
        "'; DROP TABLE users; --.example.com",
        '1 OR 1=1.example.com',
        "admin'; --",
      ];

      sqlInjectionHosts.forEach((host) => {
        const agent = resolveAIAgentFromHost({ host });
        expect(agent.id).toBe('default');
      });
    });

    it('パストラバーサル攻撃を含むホスト名に対して安全に動作すべき', () => {
      const pathTraversalHosts = [
        '../../../etc/passwd.example.com',
        '..\\..\\windows\\system32\\cmd.exe.example.com',
      ];

      pathTraversalHosts.forEach((host) => {
        const agent = resolveAIAgentFromHost({ host });
        expect(agent.id).toBe('default');
      });
    });
  });
});
