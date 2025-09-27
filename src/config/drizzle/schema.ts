import { sql } from 'drizzle-orm';
import {
  sqliteTable,
  text,
  integer,
  unique,
  index,
  check,
  primaryKey,
} from 'drizzle-orm/sqlite-core';

import { SITE_VALUES, AI_AGENT_VALUES } from '@/types/article';

/**
 * 記事データテーブル
 * Qiita、Zenn、はてなブログの記事情報を格納
 */
export const articles = sqliteTable(
  'articles',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    url: text('url').notNull(),
    author: text('author').notNull(),
    publishedAt: text('published_at').notNull(),
    site: text('site', { enum: SITE_VALUES }).notNull(),
    aiAgent: text('ai_agent', { enum: AI_AGENT_VALUES })
      .notNull()
      .default('claude-code'),
    likes: integer('likes').default(0),
    bookmarks: integer('bookmarks').default(0),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
    updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
  },
  (table) => [
    unique().on(table.url),
    // サイト追加したらここも更新する。現状はCHECK制約では動的パラメータを使用できません。
    check('site_check', sql`${table.site} IN ('qiita', 'zenn', 'hatena')`),
    index('idx_articles_site').on(table.site),
    index('idx_articles_ai_agent').on(table.aiAgent),
    index('idx_articles_published_at').on(table.publishedAt),
    index('idx_articles_engagement').on(table.likes, table.bookmarks),
  ],
);

/**
 * 週間記事要約テーブル
 * 各記事のAI要約と処理実行時点のSnapshot値を格納
 */
export const weeklySummaries = sqliteTable(
  'weekly_summaries',
  {
    articleId: text('article_id')
      .primaryKey()
      .references(() => articles.id),
    weekStartDate: text('week_start_date').notNull(), // 'YYYY-MM-DD'
    summary: text('summary').notNull(),
    // 処理実行時点のSnapshot値
    likesSnapshot: integer('likes_snapshot').notNull(),
    bookmarksSnapshot: integer('bookmarks_snapshot').notNull(),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  },
  (table) => [
    unique().on(table.articleId, table.weekStartDate),
    index('idx_weekly_summaries_week').on(table.weekStartDate),
  ],
);

/**
 * 週間レポートテーブル
 * 週単位の全体総括文章と処理状況を格納
 */
export const weeklyReports = sqliteTable(
  'weekly_reports',
  {
    weekStartDate: text('week_start_date').notNull(),
    aiAgent: text('ai_agent').notNull().default('claude-code'),
    overallSummary: text('overall_summary').notNull(),
    status: text('status', {
      enum: ['processing', 'completed', 'failed'],
    }).notNull(),
    createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  },
  (table) => [
    primaryKey({ columns: [table.weekStartDate, table.aiAgent] }),
    index('idx_weekly_reports_status').on(table.status),
    index('idx_weekly_reports_ai_agent').on(table.aiAgent),
  ],
);
