CREATE TABLE `weekly_reports` (
	`week_start_date` text PRIMARY KEY NOT NULL,
	`overall_summary` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_weekly_reports_status` ON `weekly_reports` (`status`);--> statement-breakpoint
CREATE TABLE `weekly_summaries` (
	`article_id` text PRIMARY KEY NOT NULL,
	`week_start_date` text NOT NULL,
	`summary` text NOT NULL,
	`likes_snapshot` integer NOT NULL,
	`bookmarks_snapshot` integer NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_weekly_summaries_week` ON `weekly_summaries` (`week_start_date`);--> statement-breakpoint
CREATE UNIQUE INDEX `weekly_summaries_article_id_week_start_date_unique` ON `weekly_summaries` (`article_id`,`week_start_date`);