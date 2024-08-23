CREATE TABLE `daily` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`day` integer NOT NULL,
	`classicId` text NOT NULL,
	`abilityId` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `daily_date_unique` ON `daily` (`date`);--> statement-breakpoint
CREATE UNIQUE INDEX `daily_day_unique` ON `daily` (`day`);