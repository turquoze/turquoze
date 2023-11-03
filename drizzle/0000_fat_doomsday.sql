-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
DO $$ BEGIN
 CREATE TYPE "key_status" AS ENUM('expired', 'invalid', 'valid', 'default');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "key_type" AS ENUM('aead-det', 'aead-ietf');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "action" AS ENUM('ERROR', 'TRUNCATE', 'DELETE', 'UPDATE', 'INSERT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "equality_op" AS ENUM('gte', 'gt', 'lte', 'lt', 'neq', 'eq');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "aal_level" AS ENUM('aal3', 'aal2', 'aal1');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "factor_status" AS ENUM('verified', 'unverified');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "factor_type" AS ENUM('webauthn', 'totp');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "code_challenge_method" AS ENUM('plain', 's256');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "carts" (
	"public_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"id" bigint NOT NULL,
	"metadata" json,
	"shipping" json,
	"billing" json,
	"comment" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"public_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"name" text NOT NULL,
	"parent" uuid,
	"shop" uuid,
	"id" bigint NOT NULL,
	CONSTRAINT "categories_name_key" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "discounts" (
	"public_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"type" text NOT NULL,
	"value" integer NOT NULL,
	"valid_to" timestamp,
	"valid_from" timestamp,
	"shop" uuid NOT NULL,
	"code" text NOT NULL,
	"id" bigint NOT NULL,
	CONSTRAINT "discounts_code_key" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inventories" (
	"public_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp DEFAULT (now() AT TIME ZONE 'utc'::text),
	"warehouse" uuid NOT NULL,
	"product" uuid NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"public_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"payment_status" text DEFAULT 'WAITING' NOT NULL,
	"products" json,
	"shop" uuid NOT NULL,
	"id" bigint NOT NULL,
	"price_total" integer,
	"exported" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"public_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"parent" uuid,
	"title" text NOT NULL,
	"short_description" text NOT NULL,
	"images" text[],
	"shop" uuid NOT NULL,
	"long_description" varchar,
	"id" bigint NOT NULL,
	"slug" varchar DEFAULT '' NOT NULL,
	CONSTRAINT "products_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "taxes" (
	"id" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"public_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"type" varchar DEFAULT 'Inclusive' NOT NULL,
	"name" varchar NOT NULL,
	"value" numeric NOT NULL,
	"shop" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "taxeslink" (
	"created_at" timestamp with time zone DEFAULT now(),
	"product_id" uuid NOT NULL,
	"country" varchar NOT NULL,
	"id" numeric PRIMARY KEY NOT NULL,
	"tax_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tokens" (
	"id" varchar PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"shop" uuid NOT NULL,
	"name" varchar NOT NULL,
	"secret" varchar NOT NULL,
	"role" varchar DEFAULT 'USER' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"public_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" text,
	"email" text,
	"not_active" boolean DEFAULT false NOT NULL,
	"shop" uuid,
	"password" varchar NOT NULL,
	"role" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "warehouses" (
	"public_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"country" text NOT NULL,
	"address" text NOT NULL,
	"name" text NOT NULL,
	"shop" uuid NOT NULL,
	"id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admins" (
	"id" bigserial NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
	"public_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"not_active" boolean DEFAULT false NOT NULL,
	"password" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shopslink" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"admin" uuid NOT NULL,
	"shop" uuid NOT NULL,
	"role" varchar DEFAULT 'VIEWER' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "plugins" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"public_id" uuid DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar,
	"url" varchar NOT NULL,
	"type" varchar NOT NULL,
	"shop" uuid NOT NULL,
	"token" varchar NOT NULL,
	CONSTRAINT "plugins_public_id_key" UNIQUE("public_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "oauth_tokens" (
	"id" bigserial NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
	"public_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"token" varchar NOT NULL,
	"expires_at" timestamp(6) DEFAULT (now() AT TIME ZONE 'utc'::text),
	"plugin" uuid NOT NULL,
	CONSTRAINT "oauth_tokens_plugin_key" UNIQUE("plugin")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prices" (
	"public_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"amount" integer DEFAULT 0 NOT NULL,
	"shop" uuid,
	"product" uuid NOT NULL,
	"id" bigint NOT NULL,
	"list" text DEFAULT 'Default' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizations" (
	"id" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"public_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cartitems" (
	"id" bigint PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"cart_id" uuid NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"price" integer NOT NULL,
	"type" text DEFAULT 'PRODUCT' NOT NULL,
	"item_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "returns" (
	"id" bigserial NOT NULL,
	"public_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP,
	"shop" uuid NOT NULL,
	"order_id" varchar NOT NULL,
	"items" json NOT NULL,
	"status" varchar DEFAULT 'INIT' NOT NULL,
	"exported" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shops" (
	"public_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"regions" text[],
	"currency" text,
	"name" text,
	"id" bigint NOT NULL,
	"payment_id" uuid,
	"url" varchar,
	"search_index" varchar,
	"secret" text DEFAULT 'test' NOT NULL,
	"settings" json,
	"shipping_id" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categorieslink" (
	"category" uuid NOT NULL,
	"product" uuid NOT NULL,
	CONSTRAINT categoriesLink_pkey PRIMARY KEY("category","product")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizationsLink" (
	"id" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"person" uuid NOT NULL,
	"shop" uuid NOT NULL,
	"role" text DEFAULT 'VIEWER' NOT NULL,
	CONSTRAINT organizationsLink_pkey PRIMARY KEY("person","shop")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "oauth_tokens_token_key" ON "oauth_tokens" ("token");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_fkey" FOREIGN KEY ("parent") REFERENCES "categories"("public_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categories" ADD CONSTRAINT "categories_shop_fkey" FOREIGN KEY ("shop") REFERENCES "shops"("public_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "discounts" ADD CONSTRAINT "discounts_shop_fkey" FOREIGN KEY ("shop") REFERENCES "shops"("public_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventories" ADD CONSTRAINT "inventories_product_fkey" FOREIGN KEY ("product") REFERENCES "products"("public_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventories" ADD CONSTRAINT "inventories_warehouse_fkey" FOREIGN KEY ("warehouse") REFERENCES "warehouses"("public_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_shop_fkey" FOREIGN KEY ("shop") REFERENCES "shops"("public_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_parent_fkey" FOREIGN KEY ("parent") REFERENCES "products"("public_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_shop_fkey" FOREIGN KEY ("shop") REFERENCES "shops"("public_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taxes" ADD CONSTRAINT "taxes_shop_fkey" FOREIGN KEY ("shop") REFERENCES "shops"("public_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taxeslink" ADD CONSTRAINT "taxeslink_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("public_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "taxeslink" ADD CONSTRAINT "taxeslink_tax_id_fkey" FOREIGN KEY ("tax_id") REFERENCES "taxes"("public_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tokens" ADD CONSTRAINT "tokens_shop_fkey" FOREIGN KEY ("shop") REFERENCES "shops"("public_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_shop_fkey" FOREIGN KEY ("shop") REFERENCES "shops"("public_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shopslink" ADD CONSTRAINT "shopslink_admin_fkey" FOREIGN KEY ("admin") REFERENCES "admins"("public_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "shopslink" ADD CONSTRAINT "shopslink_shop_fkey" FOREIGN KEY ("shop") REFERENCES "shops"("public_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "plugins" ADD CONSTRAINT "plugins_shop_fkey" FOREIGN KEY ("shop") REFERENCES "shops"("public_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oauth_tokens" ADD CONSTRAINT "oauth_tokens_plugin_fkey" FOREIGN KEY ("plugin") REFERENCES "plugins"("public_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prices" ADD CONSTRAINT "prices_product_fkey" FOREIGN KEY ("product") REFERENCES "products"("public_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prices" ADD CONSTRAINT "prices_shop_fkey" FOREIGN KEY ("shop") REFERENCES "shops"("public_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cartitems" ADD CONSTRAINT "cartitems_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("public_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "returns" ADD CONSTRAINT "returns_shop_fkey" FOREIGN KEY ("shop") REFERENCES "shops"("public_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categorieslink" ADD CONSTRAINT "categoriesLink_category_fkey" FOREIGN KEY ("category") REFERENCES "categories"("public_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "categorieslink" ADD CONSTRAINT "categoriesLink_product_fkey" FOREIGN KEY ("product") REFERENCES "products"("public_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organizationsLink" ADD CONSTRAINT "organizationsLink_person_fkey" FOREIGN KEY ("person") REFERENCES "users"("public_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organizationsLink" ADD CONSTRAINT "organizationsLink_shop_fkey" FOREIGN KEY ("shop") REFERENCES "shops"("public_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

*/