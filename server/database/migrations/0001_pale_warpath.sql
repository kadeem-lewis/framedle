ALTER TABLE "daily" DROP CONSTRAINT "daily_date_unique";--> statement-breakpoint
ALTER TABLE "daily" DROP CONSTRAINT "daily_day_unique";--> statement-breakpoint
ALTER TABLE "daily" ADD CONSTRAINT "daily_day_mode_pk" PRIMARY KEY("day","mode");--> statement-breakpoint
ALTER TABLE "daily" ADD COLUMN "readableDate" text NOT NULL;--> statement-breakpoint
ALTER TABLE "daily" ADD COLUMN "mode" text NOT NULL;--> statement-breakpoint
ALTER TABLE "daily" ADD COLUMN "puzzle" jsonb NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_date_mode" ON "daily" USING btree ("date","mode");--> statement-breakpoint
ALTER TABLE "daily" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "daily" DROP COLUMN "classicId";--> statement-breakpoint
ALTER TABLE "daily" DROP COLUMN "abilityId";