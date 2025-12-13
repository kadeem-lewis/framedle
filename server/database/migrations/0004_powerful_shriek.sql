ALTER TABLE "category_pairs" RENAME COLUMN "warframes" TO "validWarframes";--> statement-breakpoint
ALTER TABLE "category_pairs" ADD COLUMN "totalGuesses" integer DEFAULT 0 NOT NULL;