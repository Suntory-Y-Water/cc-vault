DROP INDEX `articles_url_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `articles_url_ai_agent_unique` ON `articles` (`url`,`ai_agent`);