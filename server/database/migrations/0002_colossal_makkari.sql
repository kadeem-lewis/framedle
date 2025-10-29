CREATE TYPE "public"."mode_enum" AS ENUM('classic', 'ability', 'grid');--> statement-breakpoint
CREATE TYPE "public"."queue_mode_enum" AS ENUM('warframe', 'ability');--> statement-breakpoint
CREATE TABLE "queue" (
	"name" "queue_mode_enum" PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"updatedAt" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "daily" ALTER COLUMN "mode" SET DATA TYPE "public"."mode_enum" USING "mode"::"public"."mode_enum";