PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_weekly_reports` (
	`week_start_date` text NOT NULL,
	`ai_agent` text DEFAULT 'claude-code' NOT NULL,
	`overall_summary` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	PRIMARY KEY(`week_start_date`, `ai_agent`)
);
--> statement-breakpoint
INSERT INTO `__new_weekly_reports`("week_start_date", "ai_agent", "overall_summary", "status", "created_at") SELECT "week_start_date", "ai_agent", "overall_summary", "status", "created_at" FROM `weekly_reports`;--> statement-breakpoint
DROP TABLE `weekly_reports`;--> statement-breakpoint
ALTER TABLE `__new_weekly_reports` RENAME TO `weekly_reports`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_weekly_reports_status` ON `weekly_reports` (`status`);--> statement-breakpoint
CREATE INDEX `idx_weekly_reports_ai_agent` ON `weekly_reports` (`ai_agent`);