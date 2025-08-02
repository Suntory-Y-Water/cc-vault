import { sql } from 'drizzle-orm';
import {
  sqliteTable,
  text,
  integer,
  unique,
  index,
  check,
} from 'drizzle-orm/sqlite-core';

import { SITE_VALUES } from '@/types/article';

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
    index('idx_articles_published_at').on(table.publishedAt),
    index('idx_articles_engagement').on(table.likes, table.bookmarks),
  ],
);
