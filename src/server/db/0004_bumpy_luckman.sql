DROP INDEX `cityId_idx` ON `ironswords_warehouse`;
ALTER TABLE `ironswords_warehouse` ADD `location_id` varchar(128);
ALTER TABLE `ironswords_warehouse` ADD `priority` enum('UNDER','FULL','OVER');--> statement-breakpoint
CREATE INDEX `locationId_idx` ON `ironswords_warehouse` (`location_id`);
UPDATE warehouse AS w
JOIN location AS l ON w.city_id = l.city_id
SET w.location_id = l.location_id;
ALTER TABLE `ironswords_warehouse` DROP COLUMN `city_id`;