DROP INDEX `cityId_idx` ON `ironswords_warehouse`;--> statement-breakpoint
ALTER TABLE `ironswords_warehouse` ADD `location_id` varchar(128);--> statement-breakpoint
ALTER TABLE `ironswords_warehouse` ADD `priority` enum('UNDER','FULL','OVER');--> statement-breakpoint
CREATE INDEX `locationId_idx` ON `ironswords_warehouse` (`location_id`);--> statement-breakpoint
ALTER TABLE `ironswords_warehouse` DROP COLUMN `city_id`;