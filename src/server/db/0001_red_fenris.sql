ALTER TABLE `ironswords_categorie` MODIFY COLUMN `category_id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `ironswords_city` MODIFY COLUMN `city_id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `ironswords_item` MODIFY COLUMN `item_id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `ironswords_location_operator` MODIFY COLUMN `location_id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `ironswords_location_operator` MODIFY COLUMN `operator_id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `ironswords_location` MODIFY COLUMN `location_id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `ironswords_location` MODIFY COLUMN `city_id` varchar(128);--> statement-breakpoint
ALTER TABLE `ironswords_operator` MODIFY COLUMN `operator_id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `ironswords_ticket_response` MODIFY COLUMN `response_id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `ironswords_ticket_response` MODIFY COLUMN `ticket_id` varchar(128);--> statement-breakpoint
ALTER TABLE `ironswords_ticket_response` MODIFY COLUMN `user_id` varchar(128);--> statement-breakpoint
ALTER TABLE `ironswords_ticket` MODIFY COLUMN `ticket_id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `ironswords_ticket` MODIFY COLUMN `location_id` varchar(128);--> statement-breakpoint
ALTER TABLE `ironswords_ticket` MODIFY COLUMN `operator_id` varchar(128);--> statement-breakpoint
ALTER TABLE `ironswords_warehouse` MODIFY COLUMN `warehouse_id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `ironswords_location` DROP COLUMN `operator_id`;