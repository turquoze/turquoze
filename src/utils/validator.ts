import {
  any,
  array,
  createInsertSchema,
  email,
  KeyLike,
  maxLength,
  minLength,
  nullable,
  number,
  object,
  optional,
  Output,
  string,
  valibot_uuid as uuid,
} from "../deps.ts";
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
export type Category = Output<typeof insertCategorySchema>;

//@ts-ignore TS2345
export const insertCartSchema = createInsertSchema(carts);
export type DBCart = Output<typeof insertCartSchema>;
export type Cart = DBCart & { items: Array<CartItem> };

//@ts-ignore TS2345
export const insertDiscountSchema = createInsertSchema(discounts);
export type Discount = Output<typeof insertDiscountSchema>;

//@ts-ignore TS2345
export const insertInventorySchema = createInsertSchema(inventories);
export type Inventory = Output<typeof insertInventorySchema>;

//@ts-ignore TS2345
export const insertOrderSchema = createInsertSchema(orders);
export type Order = Output<typeof insertOrderSchema>;

//@ts-ignore TS2345
export const insertProductSchema = createInsertSchema(products, {
  images: optional(array(string())),
});
export type DBProduct = Output<typeof insertProductSchema>;
export type Product = DBProduct & { price: number };

//@ts-ignore TS2345
export const insertTaxSchema = createInsertSchema(taxes);
export type Tax = Output<typeof insertTaxSchema>;

//@ts-ignore TS2345
export const insertTaxLinkSchema = createInsertSchema(taxeslink);
export type TaxProductLink = Output<typeof insertTaxLinkSchema>;

//@ts-ignore TS2345
export const insertTokenSchema = createInsertSchema(tokens);
export type Token = Output<typeof insertTokenSchema>;

//@ts-ignore TS2345
export const insertUserSchema = createInsertSchema(users);
export type User = Output<typeof insertUserSchema>;

//@ts-ignore TS2345
export const insertWarehouseSchema = createInsertSchema(warehouses);
export type Warehouse = Output<typeof insertWarehouseSchema>;

//@ts-ignore TS2345
export const insertAdminSchema = createInsertSchema(admins);
export type Admin = Output<typeof insertAdminSchema>;

//@ts-ignore TS2345
export const insertShopLinkSchema = createInsertSchema(shopslink);
export type ShopLink = Output<typeof insertShopLinkSchema>;

//@ts-ignore TS2345
export const insertPluginSchema = createInsertSchema(plugins);
export type Plugin = Output<typeof insertPluginSchema>;

//@ts-ignore TS2345
export const insertOauthTokenSchema = createInsertSchema(oauthTokens);
export type OauthToken = Output<typeof insertOauthTokenSchema>;

//@ts-ignore TS2345
export const insertPriceSchema = createInsertSchema(prices);
export type Price = Output<typeof insertPriceSchema>;

//@ts-ignore TS2345
export const insertOrganizationSchema = createInsertSchema(organizations);
export type Organization = Output<typeof insertOrganizationSchema>;

//@ts-ignore TS2345
export const insertCartItemSchema = createInsertSchema(cartitems);
export type DBCartItem = Output<typeof insertCartItemSchema>;
export type CartItem = DBCartItem & { totalPrice: number };

//@ts-ignore TS2345
export const insertReturnSchema = createInsertSchema(returns);
export type Return = Output<typeof insertReturnSchema>;

//@ts-ignore TS2345
export const insertShopSchema = createInsertSchema(shops, {
  id: optional(number()),
  regions: array(string()),
});
insertShopSchema._types?.input.regions;
export type DBShop = Output<typeof insertShopSchema>;
export type Shop = DBShop & {
  _signKey: Uint8Array | KeyLike;
  _role: TurquozeRole;
};

//@ts-ignore TS2345
export const insertCategoryLinkSchema = createInsertSchema(categorieslink);
export type CategoryLink = Output<typeof insertCategoryLinkSchema>;

export const insertOrganizationLinkSchema = createInsertSchema(
  //@ts-ignore TS2345
  organizationsLink,
  {
    //id: optional(number()),
  },
);
export type OrganizationLink = Output<typeof insertOrganizationLinkSchema>;

export const UuidSchema = object({
  id: string([uuid()]),
});

export const DiscountItemSchema = object({
  code: string([uuid()]),
});

export const SearchSchema = object({
  index: string(),
  query: string(),
  options: nullable(any()),
});

export const LoginSchema = object({
  email: string([email()]),
  password: string([minLength(6)]),
  shop: string([uuid()]),
});

export const MetadataSchema = object({
  metadata: string(),
});

export const CommentSchema = object({
  comment: string([minLength(2)]),
});

export const ShippingSchema = object({
  name: string([minLength(3)]),
  address1: string([minLength(3)]),
  address2: string([minLength(3)]),
  city: string([minLength(3)]),
  state: string([minLength(3)]),
  zip: string([minLength(3)]),
  country: string([minLength(2), maxLength(4)]),
  phone: string([minLength(5)]),
});
