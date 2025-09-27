ALTER TABLE `articles` ADD `ai_agent` text DEFAULT 'claude-code' NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_articles_ai_agent` ON `articles` (`ai_agent`);