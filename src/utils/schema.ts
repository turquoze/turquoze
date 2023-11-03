import {
  bigint,
  bigserial,
  boolean,
  foreignKey,
  integer,
  json,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";
export const keyStatus = pgEnum("key_status", [
  "expired",
  "invalid",
  "valid",
  "default",
]);
export const keyType = pgEnum("key_type", ["aead-det", "aead-ietf"]);
export const action = pgEnum("action", [
  "ERROR",
  "TRUNCATE",
  "DELETE",
  "UPDATE",
  "INSERT",
]);
export const equalityOp = pgEnum("equality_op", [
  "gte",
  "gt",
  "lte",
  "lt",
  "neq",
  "eq",
]);
export const aalLevel = pgEnum("aal_level", ["aal3", "aal2", "aal1"]);
export const factorStatus = pgEnum("factor_status", ["verified", "unverified"]);
export const factorType = pgEnum("factor_type", ["webauthn", "totp"]);
export const codeChallengeMethod = pgEnum("code_challenge_method", [
  "plain",
  "s256",
]);

export const carts = pgTable("carts", {
  publicId: uuid("public_id").default(sql`uuid_generate_v4()`).primaryKey()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint("id", { mode: "number" }).notNull(),
  metadata: json("metadata"),
  shipping: json("shipping"),
  billing: json("billing"),
  comment: varchar("comment"),
});

export const categories = pgTable("categories", {
  publicId: uuid("public_id").default(sql`uuid_generate_v4()`).primaryKey()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow(),
  name: text("name").notNull(),
  parent: uuid("parent"),
  shop: uuid("shop").references(() => shops.publicId),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint("id", { mode: "number" }).notNull(),
}, (table) => {
  return {
    categoriesParentFkey: foreignKey({
      columns: [table.parent],
      foreignColumns: [table.publicId],
    }),
    categoriesNameKey: unique("categories_name_key").on(table.name),
  };
});

export const discounts = pgTable("discounts", {
  publicId: uuid("public_id").default(sql`uuid_generate_v4()`).primaryKey()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow(),
  type: text("type").notNull(),
  value: integer("value").notNull(),
  validTo: timestamp("valid_to", { mode: "string" }),
  validFrom: timestamp("valid_from", { mode: "string" }),
  shop: uuid("shop").notNull().references(() => shops.publicId),
  code: text("code").notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint("id", { mode: "number" }).notNull(),
}, (table) => {
  return {
    discountsCodeKey: unique("discounts_code_key").on(table.code),
  };
});

export const inventories = pgTable("inventories", {
  publicId: uuid("public_id").default(sql`uuid_generate_v4()`).primaryKey()
    .notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).default(sql`now()`),
  warehouse: uuid("warehouse").notNull().references(() => warehouses.publicId),
  product: uuid("product").notNull().references(() => products.publicId),
  quantity: integer("quantity").default(0).notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint("id", { mode: "number" }).notNull(),
});

export const orders = pgTable("orders", {
  publicId: uuid("public_id").default(sql`uuid_generate_v4()`).primaryKey()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow(),
  paymentStatus: text("payment_status").default("WAITING").notNull(),
  products: json("products"),
  shop: uuid("shop").notNull().references(() => shops.publicId),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint("id", { mode: "number" }).notNull(),
  priceTotal: integer("price_total"),
  exported: boolean("exported").default(false).notNull(),
});

export const products = pgTable("products", {
  publicId: uuid("public_id").default(sql`uuid_generate_v4()`).primaryKey()
    .notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).default(sql`now()`)
    .notNull(),
  active: boolean("active").default(false).notNull(),
  parent: uuid("parent"),
  title: text("title").notNull(),
  shortDescription: text("short_description").notNull(),
  images: text("images").array(),
  shop: uuid("shop").notNull().references(() => shops.publicId),
  longDescription: varchar("long_description"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint("id", { mode: "number" }).notNull(),
  slug: varchar("slug").default("").notNull(),
}, (table) => {
  return {
    productsParentFkey: foreignKey({
      columns: [table.parent],
      foreignColumns: [table.publicId],
    }),
    productsSlugKey: unique("products_slug_key").on(table.slug),
  };
});

export const taxes = pgTable("taxes", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint("id", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow(),
  publicId: uuid("public_id").default(sql`uuid_generate_v4()`).primaryKey()
    .notNull(),
  type: varchar("type").default("Inclusive").notNull(),
  name: varchar("name").notNull(),
  value: numeric("value").notNull(),
  shop: uuid("shop").notNull().references(() => shops.publicId),
});

export const taxeslink = pgTable("taxeslink", {
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow(),
  productId: uuid("product_id").notNull().references(() => products.publicId),
  country: varchar("country").notNull(),
  id: numeric("id").primaryKey().notNull(),
  taxId: uuid("tax_id").notNull().references(() => taxes.publicId),
});

export const tokens = pgTable("tokens", {
  id: varchar("id").primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow(),
  shop: uuid("shop").notNull().references(() => shops.publicId),
  name: varchar("name").notNull(),
  secret: varchar("secret").notNull(),
  role: varchar("role").default("USER").notNull(),
});

export const users = pgTable("users", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint("id", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow(),
  publicId: uuid("public_id").default(sql`uuid_generate_v4()`).primaryKey()
    .notNull(),
  name: text("name"),
  email: text("email"),
  notActive: boolean("not_active").default(false).notNull(),
  shop: uuid("shop").references(() => shops.publicId),
  password: varchar("password").notNull(),
  role: varchar("role"),
});

export const warehouses = pgTable("warehouses", {
  publicId: uuid("public_id").default(sql`uuid_generate_v4()`).primaryKey()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow(),
  country: text("country").notNull(),
  address: text("address").notNull(),
  name: text("name").notNull(),
  shop: uuid("shop").notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint("id", { mode: "number" }).notNull(),
});

export const admins = pgTable("admins", {
  id: bigserial("id", { mode: "bigint" }).notNull(),
  createdAt: timestamp("created_at", {
    precision: 6,
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  publicId: uuid("public_id").default(sql`uuid_generate_v4()`).primaryKey()
    .notNull(),
  name: text("name"),
  email: text("email").notNull(),
  notActive: boolean("not_active").default(false).notNull(),
  password: varchar("password").notNull(),
});

export const shopslink = pgTable("shopslink", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow(),
  admin: uuid("admin").notNull().references(() => admins.publicId),
  shop: uuid("shop").notNull().references(() => shops.publicId),
  role: varchar("role").default("VIEWER").notNull(),
});

export const plugins = pgTable("plugins", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow(),
  publicId: uuid("public_id").default(sql`uuid_generate_v4()`).notNull(),
  name: varchar("name"),
  url: varchar("url").notNull(),
  type: varchar("type").notNull(),
  shop: uuid("shop").notNull().references(() => shops.publicId, {
    onDelete: "cascade",
  }),
  token: varchar("token").notNull(),
}, (table) => {
  return {
    pluginsPublicIdKey: unique("plugins_public_id_key").on(table.publicId),
  };
});

export const oauthTokens = pgTable("oauth_tokens", {
  id: bigserial("id", { mode: "bigint" }).notNull(),
  createdAt: timestamp("created_at", {
    precision: 6,
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  publicId: uuid("public_id").default(sql`uuid_generate_v4()`).primaryKey()
    .notNull(),
  token: varchar("token").notNull(),
  expiresAt: timestamp("expires_at", { precision: 6, mode: "string" }).default(
    sql`now()`,
  ),
  plugin: uuid("plugin").notNull().references(() => plugins.publicId, {
    onDelete: "cascade",
  }),
}, (table) => {
  return {
    tokenKey: uniqueIndex("oauth_tokens_token_key").on(table.token),
    oauthTokensPluginKey: unique("oauth_tokens_plugin_key").on(table.plugin),
  };
});

export const prices = pgTable("prices", {
  publicId: uuid("public_id").default(sql`uuid_generate_v4()`).primaryKey()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow(),
  amount: integer("amount").default(0).notNull(),
  shop: uuid("shop").references(() => shops.publicId),
  product: uuid("product").notNull().references(() => products.publicId),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint("id", { mode: "number" }).notNull(),
  list: text("list").default("Default").notNull(),
});

export const organizations = pgTable("organizations", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint("id", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow(),
  publicId: uuid("public_id").defaultRandom().primaryKey().notNull(),
  name: text("name").notNull(),
});

export const cartitems = pgTable("cartitems", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow(),
  cartId: uuid("cart_id").notNull().references(() => carts.publicId, {
    onDelete: "cascade",
  }),
  quantity: integer("quantity").default(1).notNull(),
  price: integer("price").notNull(),
  type: text("type").default("PRODUCT").notNull(),
  itemId: uuid("item_id"),
});

export const returns = pgTable("returns", {
  id: bigserial("id", { mode: "bigint" }).notNull(),
  publicId: uuid("public_id").default(sql`uuid_generate_v4()`).primaryKey()
    .notNull(),
  createdAt: timestamp("created_at", {
    precision: 6,
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  shop: uuid("shop").notNull().references(() => shops.publicId),
  orderId: varchar("order_id").notNull(),
  items: json("items").notNull(),
  status: varchar("status").default("INIT").notNull(),
  exported: boolean("exported").default(false).notNull(),
});

export const shops = pgTable("shops", {
  publicId: uuid("public_id").default(sql`uuid_generate_v4()`).primaryKey()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow(),
  regions: text("regions").array(),
  currency: text("currency"),
  name: text("name"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint("id", { mode: "number" }).notNull(),
  paymentId: uuid("payment_id"),
  url: varchar("url"),
  searchIndex: varchar("search_index"),
  secret: text("secret").default("test").notNull(),
  settings: json("settings"),
  shippingId: varchar("shipping_id"),
});

export const categorieslink = pgTable("categorieslink", {
  category: uuid("category").notNull().references(() => categories.publicId),
  product: uuid("product").notNull().references(() => products.publicId),
}, (table) => {
  return {
    categoriesLinkPkey: primaryKey(table.category, table.product),
  };
});

export const organizationsLink = pgTable("organizationsLink", {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint("id", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow(),
  person: uuid("person").notNull().references(() => users.publicId, {
    onDelete: "cascade",
  }),
  shop: uuid("shop").notNull().references(() => shops.publicId, {
    onDelete: "cascade",
  }),
  role: text("role").default("VIEWER").notNull(),
}, (table) => {
  return {
    organizationsLinkPkey: primaryKey(table.person, table.shop),
  };
});
