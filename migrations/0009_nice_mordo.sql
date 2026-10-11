ALTER TABLE `apps` ADD `custom_domain` text;--> statement-breakpoint
ALTER TABLE `apps` ADD `custom_domain_status` text;--> statement-breakpoint
ALTER TABLE `apps` ADD `custom_domain_cloudflare_id` text;--> statement-breakpoint
ALTER TABLE `apps` ADD `custom_domain_error` text;--> statement-breakpoint
ALTER TABLE `apps` ADD `custom_domain_created_at` integer;--> statement-breakpoint
CREATE UNIQUE INDEX `apps_custom_domain_idx` ON `apps` (`custom_domain`);