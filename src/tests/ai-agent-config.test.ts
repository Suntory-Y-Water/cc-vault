import { describe, it, expect } from 'vitest';
import {
  resolveAIAgentFromHost,
  getAIAgentConfig,
} from '../config/ai-agents.ts';

describe('AI Agent Configuration System', () => {
  describe('resolveAIAgentFromHost', () => {
    it.skip('should resolve claude-code agent from subdomain', () => {
      const agent = resolveAIAgentFromHost({
        host: 'claude-code.cc-vault.com',
      });
      expect(agent.id).toBe('claude-code');
      expect(agent.name).toBe('Claude Code');
    });

    it.skip('should resolve codex agent from subdomain', () => {
      const agent = resolveAIAgentFromHost({ host: 'codex.cc-vault.com' });
      expect(agent.id).toBe('codex');
      expect(agent.name).toBe('Codex');
    });

    it('should fallback to default agent for unknown subdomain', () => {
      const agent = resolveAIAgentFromHost({ host: 'unknown.cc-vault.com' });
      expect(agent.id).toBe('default');
    });

    it('should handle null host by returning default agent', () => {
      const agent = resolveAIAgentFromHost({ host: null });
      expect(agent.id).toBe('default');
    });

    it('should handle localhost development environment', () => {
      const agent = resolveAIAgentFromHost({ host: 'localhost:3000' });
      expect(agent.id).toBe('default');
    });

    it('should handle main domain without subdomain', () => {
      const agent = resolveAIAgentFromHost({ host: 'cc-vault.com' });
      expect(agent.id).toBe('default');
    });
  });

  describe('getAIAgentConfig', () => {
    it('should return claude-code agent configuration', () => {
      const agent = getAIAgentConfig({ agentId: 'claude-code' });
      expect(agent).toBeDefined();
      expect(agent.id).toBe('claude-code');
      expect(agent.name).toBe('Claude Code');
      expect(agent.colors).toBeDefined();
      expect(agent.branding).toBeDefined();
    });

    it('should return codex agent configuration', () => {
      const agent = getAIAgentConfig({ agentId: 'codex' });
      expect(agent).toBeDefined();
      expect(agent.id).toBe('codex');
      expect(agent.name).toBe('Codex');
    });

    it('should return default agent for unknown id', () => {
      const agent = getAIAgentConfig({ agentId: 'unknown' });
      expect(agent.id).toBe('default');
    });

    it('should have complete agent configuration structure', () => {
      const agent = getAIAgentConfig({ agentId: 'claude-code' });

      // Check colors structure
      expect(agent.colors).toHaveProperty('primary');
      expect(agent.colors).toHaveProperty('secondary');
      expect(agent.colors).toHaveProperty('accent');

      // Check branding structure
      expect(agent.branding).toHaveProperty('siteName');

      // Check content filter
      expect(Array.isArray(agent.contentFilter)).toBe(true);
    });
  });
});
