CREATE TABLE `ironswords_account` (
	`userId` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` int,
	`token_type` varchar(255),
	`scope` varchar(255),
	`id_token` text,
	`session_state` varchar(255),
	CONSTRAINT `ironswords_account_provider_providerAccountId` PRIMARY KEY(`provider`,`providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `ironswords_categorie` (
	`category_id` varchar(21) NOT NULL,
	`name` varchar(255),
	CONSTRAINT `ironswords_categorie_category_id` PRIMARY KEY(`category_id`)
);
--> statement-breakpoint
CREATE TABLE `ironswords_city` (
	`city_id` varchar(21) NOT NULL,
	`name` varchar(255),
	CONSTRAINT `ironswords_city_city_id` PRIMARY KEY(`city_id`)
);
--> statement-breakpoint
CREATE TABLE `ironswords_item` (
	`item_id` varchar(21) NOT NULL,
	`warehouse_id` int,
	`category_id` int,
	`name` varchar(255),
	`quantity` int,
	`stock` enum('none','low','medium','high'),
	`last_updated` datetime,
	CONSTRAINT `ironswords_item_item_id` PRIMARY KEY(`item_id`)
);
--> statement-breakpoint
CREATE TABLE `ironswords_location_operator` (
	`location_id` int NOT NULL,
	`operator_id` int NOT NULL,
	`role` enum('Admin','Operator'),
	CONSTRAINT `ironswords_location_operator_location_id_operator_id` PRIMARY KEY(`location_id`,`operator_id`)
);
--> statement-breakpoint
CREATE TABLE `ironswords_location` (
	`location_id` varchar(21) NOT NULL,
	`name` varchar(255),
	`address` varchar(255),
	`city_id` int,
	`operator_id` int,
	CONSTRAINT `ironswords_location_location_id` PRIMARY KEY(`location_id`)
);
--> statement-breakpoint
CREATE TABLE `ironswords_operator` (
	`operator_id` varchar(21) NOT NULL,
	`name` varchar(255),
	`user_id` varchar(255),
	`phone` varchar(255),
	`email` varchar(255),
	`contact_info` varchar(255),
	CONSTRAINT `ironswords_operator_operator_id` PRIMARY KEY(`operator_id`),
	CONSTRAINT `ironswords_operator_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `ironswords_session` (
	`sessionToken` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `ironswords_session_sessionToken` PRIMARY KEY(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `ironswords_ticket_response` (
	`response_id` varchar(21) NOT NULL,
	`ticket_id` int,
	`user_id` int,
	`message` text,
	`is_requesting_transportion` boolean,
	`is_client_done` boolean,
	`is_client_drop` boolean,
	`created_at` datetime,
	CONSTRAINT `ironswords_ticket_response_response_id` PRIMARY KEY(`response_id`)
);
--> statement-breakpoint
CREATE TABLE `ironswords_ticket` (
	`ticket_id` varchar(21) NOT NULL,
	`location_id` int,
	`operator_id` int,
	`title` varchar(255),
	`description` text,
	`priority` enum('LOW','MID','HIGH','URGENT'),
	`status` enum('OPEN','CLOSED','ASSIGNED'),
	`deadline` datetime,
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `ironswords_ticket_ticket_id` PRIMARY KEY(`ticket_id`)
);
--> statement-breakpoint
CREATE TABLE `ironswords_user` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`email` varchar(255) NOT NULL,
	`emailVerified` timestamp(3) DEFAULT CURRENT_TIMESTAMP(3),
	`role` enum('USER','ADMIN') DEFAULT 'USER',
	`image` varchar(255),
	CONSTRAINT `ironswords_user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ironswords_verificationToken` (
	`identifier` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `ironswords_verificationToken_identifier_token` PRIMARY KEY(`identifier`,`token`)
);
--> statement-breakpoint
CREATE TABLE `ironswords_warehouse` (
	`warehouse_id` varchar(21) NOT NULL,
	`name` varchar(255),
	`city_id` int,
	CONSTRAINT `ironswords_warehouse_warehouse_id` PRIMARY KEY(`warehouse_id`)
);
--> statement-breakpoint
CREATE INDEX `userId_idx` ON `ironswords_account` (`userId`);--> statement-breakpoint
CREATE INDEX `warehouseId_idx` ON `ironswords_item` (`warehouse_id`);--> statement-breakpoint
CREATE INDEX `categoryId_idx` ON `ironswords_item` (`category_id`);--> statement-breakpoint
CREATE INDEX `stock_idx` ON `ironswords_item` (`stock`);--> statement-breakpoint
CREATE INDEX `lastUpdated_idx` ON `ironswords_item` (`last_updated`);--> statement-breakpoint
CREATE INDEX `warehouseIdCategoryId_idx` ON `ironswords_item` (`warehouse_id`,`category_id`);--> statement-breakpoint
CREATE INDEX `locationOperatorLocationId_idx` ON `ironswords_location_operator` (`location_id`);--> statement-breakpoint
CREATE INDEX `cityId_idx` ON `ironswords_location` (`city_id`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `ironswords_operator` (`user_id`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `ironswords_session` (`userId`);--> statement-breakpoint
CREATE INDEX `ticketId_idx` ON `ironswords_ticket_response` (`ticket_id`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `ironswords_ticket_response` (`user_id`);--> statement-breakpoint
CREATE INDEX `createdAt_idx` ON `ironswords_ticket_response` (`created_at`);--> statement-breakpoint
CREATE INDEX `isClientDone_idx` ON `ironswords_ticket_response` (`is_client_done`);--> statement-breakpoint
CREATE INDEX `isClientDrop_idx` ON `ironswords_ticket_response` (`is_client_drop`);--> statement-breakpoint
CREATE INDEX `locationId_idx` ON `ironswords_ticket` (`location_id`);--> statement-breakpoint
CREATE INDEX `priotity_idx` ON `ironswords_ticket` (`priority`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `ironswords_ticket` (`status`);--> statement-breakpoint
CREATE INDEX `deadline_idx` ON `ironswords_ticket` (`deadline`);--> statement-breakpoint
CREATE INDEX `operatorId_idx` ON `ironswords_ticket` (`operator_id`);--> statement-breakpoint
CREATE INDEX `createdAt_idx` ON `ironswords_ticket` (`created_at`);--> statement-breakpoint
CREATE INDEX `locationIdPriority_idx` ON `ironswords_ticket` (`location_id`,`priority`);--> statement-breakpoint
CREATE INDEX `locationIdStatus_idx` ON `ironswords_ticket` (`location_id`,`status`);--> statement-breakpoint
CREATE INDEX `locationIdDeadline_idx` ON `ironswords_ticket` (`location_id`,`deadline`);--> statement-breakpoint
CREATE INDEX `locationIdCreatedAt_idx` ON `ironswords_ticket` (`location_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `cityId_idx` ON `ironswords_warehouse` (`city_id`);