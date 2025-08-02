CREATE TABLE `articles` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`author` text NOT NULL,
	`published_at` text NOT NULL,
	`site` text NOT NULL,
	`likes` integer DEFAULT 0,
	`bookmarks` integer DEFAULT 0,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	CONSTRAINT "site_check" CHECK("articles"."site" IN ('qiita', 'zenn', 'hatena'))
);
--> statement-breakpoint
CREATE INDEX `idx_articles_site` ON `articles` (`site`);--> statement-breakpoint
CREATE INDEX `idx_articles_published_at` ON `articles` (`published_at`);--> statement-breakpoint
CREATE INDEX `idx_articles_engagement` ON `articles` (`likes`,`bookmarks`);--> statement-breakpoint
CREATE UNIQUE INDEX `articles_url_unique` ON `articles` (`url`);