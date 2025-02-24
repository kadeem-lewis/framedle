CREATE TABLE "daily" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"day" integer NOT NULL,
	"classicId" text NOT NULL,
	"abilityId" text NOT NULL,
	CONSTRAINT "daily_date_unique" UNIQUE("date"),
	CONSTRAINT "daily_day_unique" UNIQUE("day")
);
