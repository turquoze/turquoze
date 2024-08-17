import { createInsertSchema, KeyLike } from "../deps.ts";

import {
  any,
  array,
  email,
  InferOutput,
  maxLength,
  minLength,
  nullable,
  number,
  object,
  optional,
  pipe,
  string,
  uuid,
} from "@valibot/valibot";

import {
  admins,
  cartitems,
  carts,
  categories,
  categorieslink,
  discounts,
  inventories,
  oauthTokens,
  orders,
  organizations,
  organizationsLink,
  plugins,
  prices,
  products,
  returns,
  shops,
  shopslink,
  taxes,
  taxeslink,
  tokens,
  users,
  warehouses,
} from "./schema.ts";
import { TurquozeRole } from "./types.ts";

//@ts-ignore TS2345
export const insertCategorySchema = createInsertSchema(categories);
export type Category = InferOutput<typeof insertCategorySchema>;

//@ts-ignore TS2345
export const insertCartSchema = createInsertSchema(carts);
export type DBCart = InferOutput<typeof insertCartSchema>;
export type Cart = DBCart & { items: Array<CartItem> };

//@ts-ignore TS2345
export const insertDiscountSchema = createInsertSchema(discounts);
export type Discount = InferOutput<typeof insertDiscountSchema>;

//@ts-ignore TS2345
export const insertInventorySchema = createInsertSchema(inventories);
export type Inventory = InferOutput<typeof insertInventorySchema>;

//@ts-ignore TS2345
export const insertOrderSchema = createInsertSchema(orders);
export type Order = InferOutput<typeof insertOrderSchema>;

//@ts-ignore TS2345
export const insertProductSchema = createInsertSchema(products, {
  images: optional(array(string())),
});
export type DBProduct = InferOutput<typeof insertProductSchema>;
export type Product = DBProduct & { price: number };
export type SearchProduct = Product & { id: number };

//@ts-ignore TS2345
export const insertTaxSchema = createInsertSchema(taxes);
export type Tax = InferOutput<typeof insertTaxSchema>;

//@ts-ignore TS2345
export const insertTaxLinkSchema = createInsertSchema(taxeslink);
export type TaxProductLink = InferOutput<typeof insertTaxLinkSchema>;

//@ts-ignore TS2345
export const insertTokenSchema = createInsertSchema(tokens);
export type Token = InferOutput<typeof insertTokenSchema>;

//@ts-ignore TS2345
export const insertUserSchema = createInsertSchema(users);
export type User = InferOutput<typeof insertUserSchema>;

//@ts-ignore TS2345
export const insertWarehouseSchema = createInsertSchema(warehouses);
export type Warehouse = InferOutput<typeof insertWarehouseSchema>;

//@ts-ignore TS2345
export const insertAdminSchema = createInsertSchema(admins);
export type Admin = InferOutput<typeof insertAdminSchema>;

//@ts-ignore TS2345
export const insertShopLinkSchema = createInsertSchema(shopslink);
export type ShopLink = InferOutput<typeof insertShopLinkSchema>;

//@ts-ignore TS2345
export const insertPluginSchema = createInsertSchema(plugins);
export type Plugin = InferOutput<typeof insertPluginSchema>;

//@ts-ignore TS2345
export const insertOauthTokenSchema = createInsertSchema(oauthTokens);
export type OauthToken = InferOutput<typeof insertOauthTokenSchema>;

//@ts-ignore TS2345
export const insertPriceSchema = createInsertSchema(prices);
export type Price = InferOutput<typeof insertPriceSchema>;

//@ts-ignore TS2345
export const insertOrganizationSchema = createInsertSchema(organizations);
export type Organization = InferOutput<typeof insertOrganizationSchema>;

//@ts-ignore TS2345
export const insertCartItemSchema = createInsertSchema(cartitems);
export type DBCartItem = InferOutput<typeof insertCartItemSchema>;
export type CartItem = DBCartItem & { totalPrice: number };

//@ts-ignore TS2345
export const insertReturnSchema = createInsertSchema(returns);
export type Return = InferOutput<typeof insertReturnSchema>;

//@ts-ignore TS2345
export const insertShopSchema = createInsertSchema(shops, {
  id: optional(number()),
  regions: array(string()),
});
insertShopSchema._types?.input.regions;
export type DBShop = InferOutput<typeof insertShopSchema>;
export type Shop = DBShop & {
  _signKey: Uint8Array | KeyLike;
  _role: TurquozeRole;
};

//@ts-ignore TS2345
export const insertCategoryLinkSchema = createInsertSchema(categorieslink);
export type CategoryLink = InferOutput<typeof insertCategoryLinkSchema>;

export const insertOrganizationLinkSchema = createInsertSchema(
  //@ts-ignore TS2345
  organizationsLink,
  {
    //id: optional(number()),
  },
);
export type OrganizationLink = InferOutput<typeof insertOrganizationLinkSchema>;

export const UuidSchema = object({
  id: pipe(string(), uuid()),
});

export const DiscountItemSchema = object({
  code: pipe(string(), uuid()),
});

export const SearchSchema = object({
  index: string(),
  query: string(),
  options: nullable(any()),
});

export const LoginSchema = object({
  email: pipe(string(), email()),
  password: pipe(string(), minLength(6)),
  shop: pipe(string(), uuid()),
});

export const MetadataSchema = object({
  metadata: string(),
});

export const CommentSchema = object({
  comment: pipe(string(), minLength(2)),
});

export const ShippingSchema = object({
  name: pipe(string(), minLength(3)),
  address1: pipe(string(), minLength(3)),
  address2: pipe(string(), minLength(3)),
  city: pipe(string(), minLength(3)),
  state: pipe(string(), minLength(3)),
  zip: pipe(string(), minLength(3)),
  country: pipe(string(), minLength(2), maxLength(4)),
  phone: pipe(string(), minLength(5)),
});
