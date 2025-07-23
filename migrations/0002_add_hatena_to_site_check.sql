-- articlesテーブルのsite制約にhatenaを追加

-- SQLiteではALTER TABLE ... DROP CONSTRAINTが使えないため、テーブルを再作成する必要がある

-- 1. 一時テーブルを作成
CREATE TABLE articles_temp (
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

-- 2. データを一時テーブルにコピー
INSERT INTO articles_temp SELECT * FROM articles;

-- 3. 元のテーブルを削除
DROP TABLE articles;

-- 4. 一時テーブルを元の名前にリネーム
ALTER TABLE articles_temp RENAME TO articles;

-- 5. インデックスを再作成
CREATE INDEX idx_articles_site ON articles(site);
CREATE INDEX idx_articles_published_at ON articles(published_at);
CREATE INDEX idx_articles_engagement ON articles(likes, bookmarks);