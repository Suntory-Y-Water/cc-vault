-- Cloudflare D1 (SQLite) 最終テーブル設計書
-- 1. articlesテーブル（記事データ）

CREATE TABLE articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  author TEXT NOT NULL,
  published_at TEXT NOT NULL,
  site TEXT NOT NULL CHECK (site IN ('qiita', 'zenn', 'hatena')),
  likes INTEGER DEFAULT 0,
  bookmarks INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_articles_site ON articles(site);
CREATE INDEX idx_articles_published_at ON articles(published_at);
CREATE INDEX idx_articles_engagement ON articles(likes, bookmarks);

-- 2. weekly_reportsテーブル（週間レポート）

CREATE TABLE weekly_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  week_start_date TEXT NOT NULL,
  week_end_date TEXT NOT NULL,
  year INTEGER NOT NULL,
  week_number INTEGER NOT NULL,
  label TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),

  UNIQUE(week_start_date, week_end_date)
);

CREATE INDEX idx_weekly_reports_week ON weekly_reports(year, week_number);
CREATE INDEX idx_weekly_reports_date ON weekly_reports(week_start_date);

-- 3. weekly_articlesテーブル（週間記事ランキング + AI要約）

CREATE TABLE weekly_articles (
  weekly_report_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  weekly_rank INTEGER NOT NULL,
  ai_summary TEXT NOT NULL,
  likes_snapshot INTEGER NOT NULL,
  bookmarks_snapshot INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY (weekly_report_id) REFERENCES weekly_reports(id) ON DELETE CASCADE,
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,

  UNIQUE(weekly_report_id, article_id),
  UNIQUE(weekly_report_id, weekly_rank)
);

CREATE INDEX idx_weekly_articles_report ON weekly_articles(weekly_report_id);
CREATE INDEX idx_weekly_articles_rank ON weekly_articles(weekly_rank);