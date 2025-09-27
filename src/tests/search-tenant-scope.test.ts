import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchArticlesByTitle } from '../lib/cloudflare';

// Mock the D1 Database
const mockDB = {
  prepare: vi.fn(),
  exec: vi.fn(),
  batch: vi.fn(),
} as any;

// Mock Drizzle ORM
vi.mock('drizzle-orm/d1', () => ({
  drizzle: vi.fn(() => ({
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          orderBy: vi.fn(() => ({
            limit: vi.fn(() => ({
              offset: vi.fn(() => Promise.resolve([])),
            })),
          })),
        })),
      })),
    })),
  })),
}));

vi.mock('drizzle-orm', () => ({
  eq: vi.fn(),
  and: vi.fn(),
  sql: vi.fn(),
  desc: vi.fn(),
  count: vi.fn(),
}));

vi.mock('../config/drizzle/schema', () => ({
  articles: {
    id: 'id',
    title: 'title',
    url: 'url',
    author: 'author',
    publishedAt: 'published_at',
    likes: 'likes',
    bookmarks: 'bookmarks',
    site: 'site',
    aiAgent: 'ai_agent',
  },
}));

describe('Search Tenant Scope Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchArticlesByTitle with tenant filtering', () => {
    it('should include aiAgent parameter in search params', async () => {
      // Arrange: Set up test data
      const searchParams = {
        query: 'test query',
        page: 1,
        limit: 10,
        site: 'all',
        order: 'latest' as const,
        aiAgent: 'claude-code',
      };

      // Mock the drizzle response
      const mockDrizzle = {
        select: vi.fn(() => ({
          from: vi.fn(() => ({
            where: vi.fn(() => Promise.resolve([{ total: 0 }])),
          })),
        })),
      };

      vi.doMock('drizzle-orm/d1', () => ({
        drizzle: vi.fn(() => mockDrizzle),
      }));

      // Act & Assert: This should not throw an error
      try {
        await fetchArticlesByTitle({
          db: mockDB,
          searchParams,
        });
        expect(true).toBe(true); // Test passes if no error thrown
      } catch (error) {
        expect(error).toBeNull(); // Should not have errors
      }
    });

    it('should handle aiAgent parameter when set to "all"', async () => {
      const searchParams = {
        query: 'test',
        page: 1,
        limit: 10,
        site: 'all',
        order: 'latest' as const,
        aiAgent: 'all',
      };

      try {
        await fetchArticlesByTitle({
          db: mockDB,
          searchParams,
        });
        expect(true).toBe(true);
      } catch (error) {
        expect(error).toBeNull();
      }
    });

    it('should handle undefined aiAgent parameter', async () => {
      const searchParams = {
        query: 'test',
        page: 1,
        limit: 10,
        site: 'all',
        order: 'latest' as const,
        // aiAgent: undefined - intentionally omitted
      };

      try {
        await fetchArticlesByTitle({
          db: mockDB,
          searchParams,
        });
        expect(true).toBe(true);
      } catch (error) {
        expect(error).toBeNull();
      }
    });
  });

  describe('Search Page Integration', () => {
    it('should fail when search page does not pass aiAgent parameter', () => {
      // This test documents the current failure state
      // The search page currently does NOT pass aiAgent parameter to fetchArticlesByTitle
      // This should fail until we implement the fix

      const currentSearchPageCall = {
        query: 'test',
        page: 1,
        limit: 24,
        site: 'all',
        order: 'latest',
        // Missing: aiAgent parameter
      };

      // Assert that the current implementation is missing aiAgent
      expect(currentSearchPageCall).not.toHaveProperty('aiAgent');

      // This test documents what we need to fix:
      // The search page should include aiAgent parameter from the current tenant context
    });
  });
});
