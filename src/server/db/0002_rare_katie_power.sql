ALTER TABLE `ironswords_ticket` ADD `city_id` varchar(128);--> statement-breakpoint
CREATE INDEX `cityId_idx` ON `ironswords_ticket` (`city_id`);