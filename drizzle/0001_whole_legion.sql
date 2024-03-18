ALTER TABLE "admins" ADD COLUMN "shop" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "admins" ADD CONSTRAINT "admins_shop_shops_public_id_fk" FOREIGN KEY ("shop") REFERENCES "shops"("public_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
