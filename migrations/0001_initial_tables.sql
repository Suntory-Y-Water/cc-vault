-- Cloudflare D1 (SQLite) 最終テーブル設計書
-- 1. articlesテーブル（記事データ）

CREATE TABLE articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  author TEXT NOT NULL,
  published_at TEXT NOT NULL,
  site TEXT NOT NULL CHECK (site IN ('qiita', 'zenn')),
  likes INTEGER DEFAULT 0,
  bookmarks INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_articles_site ON articles(site);
CREATE INDEX idx_articles_published_at ON articles(published_at);
CREATE INDEX idx_articles_engagement ON articles(likes, bookmarks);