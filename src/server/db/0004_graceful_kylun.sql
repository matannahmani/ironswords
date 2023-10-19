ALTER TABLE `ironswords_warehouse` ADD `location_id` varchar(128);--> statement-breakpoint
ALTER TABLE `ironswords_warehouse` ADD `priority` enum('UNDER','FULL','OVER');--> statement-breakpoint
CREATE INDEX `locationId_idx` ON `ironswords_warehouse` (`location_id`);