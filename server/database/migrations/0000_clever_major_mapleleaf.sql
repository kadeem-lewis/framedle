CREATE TABLE `daily` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`day` integer NOT NULL,
	`classicId` integer NOT NULL,
	`abilityId` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `daily_day_unique` ON `daily` (`day`);