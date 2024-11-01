import {
  bigserial,
  boolean,
  dzUuid as uuid,
  foreignKey,
  integer,
  json,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  sql,
  text,
  timestamp,
  unique,
  uniqueIndex,
  varchar,
} from "../deps.ts";

export const keyStatus = pgEnum("key_status", [
  "default",
  "valid",
  "invalid",
  "expired",
]);
export const keyType = pgEnum("key_type", ["aead-ietf", "aead-det"]);
export const oneTimeTokenType = pgEnum("one_time_token_type", [
  "confirmation_token",
  "reauthentication_token",
  "recovery_token",
  "email_change_token_new",
  "email_change_token_current",
  "phone_change_token",
]);
export const equalityOp = pgEnum("equality_op", [
  "in",
  "eq",
  "neq",
  "lt",
  "lte",
  "gt",
  "gte",
]);
export const factorType = pgEnum("factor_type", ["phone", "totp", "webauthn"]);
export const aalLevel = pgEnum("aal_level", ["aal1", "aal2", "aal3"]);
export const factorStatus = pgEnum("factor_status", ["unverified", "verified"]);
export const action = pgEnum("action", [
  "INSERT",
  "UPDATE",
  "DELETE",
  "TRUNCATE",
  "ERROR",
]);
export const codeChallengeMethod = pgEnum("code_challenge_method", [
  "s256",
  "plain",
]);

export const organizations = pgTable("organizations", {
  id: bigserial("id", { mode: "bigint" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow(),
  publicId: uuid("public_id").defaultRandom().primaryKey().notNull(),
  name: text("name").notNull(),
  deleted: boolean("deleted").default(false).notNull(),
});

export const carts = pgTable("carts", {
  publicId: uuid("public_id").default(sql`uuid_generate_v4()`).primaryKey()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow(),
  id: bigserial("id", { mode: "bigint" }).notNull(),
  metadata: json("metadata"),
  shipping: json("shipping"),
  billing: json("billing"),
  comment: varchar("comment"),
});

export const cartitems = pgTable("cartitems", {
  id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
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

export const shops = pgTable("shops", {
  publicId: uuid("public_id").default(sql`uuid_generate_v4()`).primaryKey()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow(),
  regions: text("regions").array(),
  currency: text("currency"),
  name: text("name"),
  id: bigserial("id", { mode: "bigint" }).notNull(),
  paymentId: uuid("payment_id"),
  url: varchar("url"),
  searchIndex: varchar("search_index"),
  secret: text("secret").default("test").notNull(),
  settings: json("settings"),
  shippingId: varchar("shipping_id"),
  deleted: boolean("deleted").default(false).notNull(),
});

export const categories = pgTable("categories", {
  publicId: uuid("public_id").default(sql`uuid_generate_v4()`).primaryKey()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow(),
  name: text("name").notNull(),
  parent: uuid("parent"),
  shop: uuid("shop").references(() => shops.publicId),
  id: bigserial("id", { mode: "bigint" }).notNull(),
  deleted: boolean("deleted").default(false).notNull(),
}, (table) => {
  return {
    categoriesParentCategoriesPublicIdFk: foreignKey({
      columns: [table.parent],
      foreignColumns: [table.publicId],
      name: "categories_parent_categories_public_id_fk",
    }),
    categoriesNameKey: unique("categories_name_key").on(table.name),
  };
});

export const products = pgTable("products", {
  publicId: uuid("public_id").default(sql`uuid_generate_v4()`).primaryKey()
    .notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  active: boolean("active").default(false).notNull(),
  parent: uuid("parent"),
  title: text("title").notNull(),
  shortDescription: text("short_description").notNull(),
  images: text("images").array(),
  shop: uuid("shop").notNull().references(() => shops.publicId),
  longDescription: varchar("long_description"),
  id: bigserial("id", { mode: "bigint" }).notNull(),
  slug: varchar("slug").default("").notNull(),
  deleted: boolean("deleted").default(false).notNull(),
}, (table) => {
  return {
    productsParentProductsPublicIdFk: foreignKey({
      columns: [table.parent],
      foreignColumns: [table.publicId],
      name: "products_parent_products_public_id_fk",
    }),
    productsSlugKey: unique("products_slug_key").on(table.slug),
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
  id: bigserial("id", { mode: "bigint" }).notNull(),
  deleted: boolean("deleted").default(false).notNull(),
}, (table) => {
  return {
    discountsCodeKey: unique("discounts_code_key").on(table.code),
  };
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
  id: bigserial("id", { mode: "bigint" }).notNull(),
  deleted: boolean("deleted").default(false).notNull(),
});

export const inventories = pgTable("inventories", {
  publicId: uuid("public_id").default(sql`uuid_generate_v4()`).primaryKey()
    .notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  warehouse: uuid("warehouse").notNull().references(() => warehouses.publicId),
  product: uuid("product").notNull().references(() => products.publicId),
  quantity: integer("quantity").default(0).notNull(),
  id: bigserial("id", { mode: "bigint" }).notNull(),
  deleted: boolean("deleted").default(false).notNull(),
});

export const plugins = pgTable("plugins", {
  id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
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
  deleted: boolean("deleted").default(false).notNull(),
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
  expiresAt: timestamp("expires_at", { precision: 6, mode: "string" })
    .defaultNow(),
  plugin: uuid("plugin").notNull().references(() => plugins.publicId, {
    onDelete: "cascade",
  }),
}, (table) => {
  return {
    tokenKey: uniqueIndex("oauth_tokens_token_key").on(table.token),
    oauthTokensPluginKey: unique("oauth_tokens_plugin_key").on(table.plugin),
  };
});

export const orders = pgTable("orders", {
  publicId: uuid("public_id").default(sql`uuid_generate_v4()`).primaryKey()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow(),
  paymentStatus: text("payment_status").default("WAITING").notNull(),
  products: json("products"),
  shop: uuid("shop").notNull().references(() => shops.publicId),
  id: bigserial("id", { mode: "bigint" }).notNull(),
  priceTotal: integer("price_total"),
  exported: boolean("exported").default(false).notNull(),
  deleted: boolean("deleted").default(false).notNull(),
});

export const users = pgTable("users", {
  id: bigserial("id", { mode: "bigint" }).notNull(),
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
  deleted: boolean("deleted").default(false).notNull(),
});

export const prices = pgTable("prices", {
  publicId: uuid("public_id").default(sql`uuid_generate_v4()`).primaryKey()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow(),
  amount: integer("amount").default(0).notNull(),
  shop: uuid("shop").references(() => shops.publicId),
  product: uuid("product").notNull().references(() => products.publicId),
  id: bigserial("id", { mode: "bigint" }).notNull(),
  list: text("list").default("Default").notNull(),
  deleted: boolean("deleted").default(false).notNull(),
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
  deleted: boolean("deleted").default(false).notNull(),
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
  deleted: boolean("deleted").default(false).notNull(),
  shop: uuid("shop").references(() => shops.publicId),
});

export const shopslink = pgTable("shopslink", {
  id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow(),
  admin: uuid("admin").notNull().references(() => admins.publicId),
  shop: uuid("shop").notNull().references(() => shops.publicId),
  role: varchar("role").default("VIEWER").notNull(),
});

export const taxes = pgTable("taxes", {
  id: bigserial("id", { mode: "bigint" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow(),
  publicId: uuid("public_id").default(sql`uuid_generate_v4()`).primaryKey()
    .notNull(),
  type: varchar("type").default("Inclusive").notNull(),
  name: varchar("name").notNull(),
  value: numeric("value").notNull(),
  deleted: boolean("deleted").default(false).notNull(),
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
  deleted: boolean("deleted").default(false).notNull(),
});

export const categorieslink = pgTable("categorieslink", {
  category: uuid("category").notNull().references(() => categories.publicId),
  product: uuid("product").notNull().references(() => products.publicId),
}, (table) => {
  return {
    categoriesLinkPkey: primaryKey({
      columns: [table.category, table.product],
      name: "categoriesLink_pkey",
    }),
  };
});

export const organizationsLink = pgTable("organizationsLink", {
  id: bigserial("id", { mode: "bigint" }).notNull(),
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
    organizationsLinkPkey: primaryKey({
      columns: [table.person, table.shop],
      name: "organizationsLink_pkey",
    }),
  };
});
