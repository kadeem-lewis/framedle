CREATE TABLE "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"lastUsed" date DEFAULT NULL,
	"description" text NOT NULL,
	"key" text NOT NULL,
	"type" text NOT NULL,
	"warframes" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category_pairs" (
	"categoryA" text NOT NULL,
	"categoryB" text NOT NULL,
	"lastUsed" date DEFAULT NULL,
	"warframes" jsonb NOT NULL,
	CONSTRAINT "category_pairs_categoryA_categoryB_pk" PRIMARY KEY("categoryA","categoryB")
);
--> statement-breakpoint
ALTER TABLE "category_pairs" ADD CONSTRAINT "category_pairs_categoryA_categories_id_fk" FOREIGN KEY ("categoryA") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_pairs" ADD CONSTRAINT "category_pairs_categoryB_categories_id_fk" FOREIGN KEY ("categoryB") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;