CREATE TABLE `ironswords_operators_invite` (
	`invite_id` varchar(128) NOT NULL,
	`email` varchar(255) NOT NULL,
	`is_claimed` boolean DEFAULT false,
	`json` json NOT NULL,
	`expires` datetime,
	CONSTRAINT `ironswords_operators_invite_invite_id` PRIMARY KEY(`invite_id`),
	CONSTRAINT `ironswords_operators_invite_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `ironswords_account` RENAME COLUMN `userId` TO `user_id`;--> statement-breakpoint
ALTER TABLE `ironswords_session` RENAME COLUMN `userId` TO `user_id`;--> statement-breakpoint
DROP INDEX `userId_idx` ON `ironswords_account`;--> statement-breakpoint
DROP INDEX `userId_idx` ON `ironswords_session`;--> statement-breakpoint
ALTER TABLE `ironswords_account` MODIFY COLUMN `user_id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `ironswords_item` MODIFY COLUMN `warehouse_id` varchar(128);--> statement-breakpoint
ALTER TABLE `ironswords_item` MODIFY COLUMN `category_id` varchar(128);--> statement-breakpoint
ALTER TABLE `ironswords_operator` MODIFY COLUMN `name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `ironswords_operator` MODIFY COLUMN `user_id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `ironswords_operator` MODIFY COLUMN `phone` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `ironswords_operator` MODIFY COLUMN `email` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `ironswords_session` MODIFY COLUMN `user_id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `ironswords_ticket` MODIFY COLUMN `location_id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `ironswords_ticket` MODIFY COLUMN `operator_id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `ironswords_ticket` MODIFY COLUMN `city_id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `ironswords_ticket` MODIFY COLUMN `title` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `ironswords_user` MODIFY COLUMN `id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `ironswords_user` MODIFY COLUMN `role` enum('USER','ADMIN','OPERATOR') DEFAULT 'USER';--> statement-breakpoint
ALTER TABLE `ironswords_warehouse` MODIFY COLUMN `city_id` varchar(128);--> statement-breakpoint
ALTER TABLE `ironswords_ticket` ADD `category` enum('ביגוד גברים','ביגוד נשים','ביגוד ילדים בנות','ביגוד ילדים בנים','מזון','תרופות','הגיינה גברים','הגיינה נשים','הגיינה ילדים','אחר','משקפיים','שירותי כלליים') NOT NULL;--> statement-breakpoint
ALTER TABLE `ironswords_ticket` ADD `requester_name` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `ironswords_ticket` ADD `requester_phone` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `ironswords_ticket` ADD `notes` text;--> statement-breakpoint
CREATE INDEX `operatorInviteEmail_idx` ON `ironswords_operators_invite` (`email`);--> statement-breakpoint
CREATE INDEX `categoryId_idx` ON `ironswords_ticket` (`category`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `ironswords_account` (`user_id`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `ironswords_session` (`user_id`);--> statement-breakpoint
ALTER TABLE `ironswords_location_operator` DROP COLUMN `role`;