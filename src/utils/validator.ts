import { yup } from "../deps.ts";

export const ProductSchema = yup.object().shape({
  public_id: yup.string().uuid(),
  active: yup.bool().required(),
  parent: yup.string().uuid(),
  title: yup.string().min(3).required(),
  short_description: yup.string().min(3).required(),
  long_description: yup.string().min(3).required(),
  images: yup.array().of(yup.string()),
  price: yup.number().required().positive().integer(),
  slug: yup.string().min(3).required(),
});

export const ShopSchema = yup.object().shape({
  public_id: yup.string().uuid(),
  name: yup.string().min(3).required(),
  regions: yup.array().of(yup.string()),
  payment_id: yup.string(),
  shipping_id: yup.string(),
  currency: yup.string().required(),
});

export const CategorySchema = yup.object().shape({
  public_id: yup.string().uuid(),
  parent: yup.string().uuid(),
  name: yup.string().min(3).required(),
});

export const CategoryLinkSchema = yup.object().shape({
  category: yup.string().uuid().required(),
  product: yup.string().uuid().required(),
});

export const UuidSchema = yup.object().shape({
  id: yup.string().uuid().required(),
});

export const DiscountSchema = yup.object().shape({
  public_id: yup.string().uuid(),
  type: yup.string().matches(/(FIXED|PERCENT)/).required(),
  value: yup.number().required().positive().integer(),
  valid_to: yup.date().nullable(true),
  valid_from: yup.date().nullable(true),
  shop: yup.string().uuid().nullable(true),
});

export const CartSchema = yup.object().shape({
  public_id: yup.string().uuid().nullable(true),
  created_at: yup.date().nullable(true),
});

export const CartItemSchema = yup.object().shape({
  cart_id: yup.string().uuid().required(),
  item_id: yup.string().uuid().required(),
  price: yup.number().positive().integer().required(),
  quantity: yup.number().positive().integer().required(),
});

export const SearchSchema = yup.object().shape({
  query: yup.string().nullable(true),
  options: yup.object().nullable(),
});

export const WarehouseSchema = yup.object().shape({
  public_id: yup.string().uuid().nullable(true),
  created_at: yup.date().nullable(true),
  shop: yup.string().uuid().required(),
  name: yup.string().min(3).required(),
  country: yup.string().min(2).required(),
  address: yup.string().min(5).required(),
});

export const InventorySchema = yup.object().shape({
  public_id: yup.string().uuid().nullable(true),
  created_at: yup.date().nullable(true),
  warehouse: yup.string().uuid().required(),
  product: yup.string().uuid().required(),
  quantity: yup.number().positive().integer().required(),
});

export const PriceSchema = yup.object().shape({
  public_id: yup.string().uuid(),
  created_at: yup.date().nullable(true),
  amount: yup.number().required().positive().integer(),
  shop: yup.string().uuid().required(),
  product: yup.string().uuid().required(),
});

export const DiscountCheckSchema = yup.object().shape({
  code: yup.string().min(3).required(),
});

export const UserSchema = yup.object().shape({
  id: yup.number().positive().integer().nullable(true),
  public_id: yup.string().uuid().nullable(true),
  created_at: yup.date().nullable(true),
  name: yup.string().required().min(3),
  email: yup.string().email(),
  password: yup.string().required().min(6),
  not_active: yup.bool().default(false),
  shop: yup.string().uuid().required(),
});

export const LoginSchema = yup.object().shape({
  email: yup.string().email(),
  password: yup.string().required().min(6),
  shop: yup.string().uuid().required(),
});

export const MetadataSchema = yup.object().shape({
  metadata: yup.object().nullable(true),
});

export const CommentSchema = yup.object().shape({
  comment: yup.string().required().min(2).nullable(false),
});

export const ShippingSchema = yup.object().shape({
  name: yup.string().min(3).required(),
  address1: yup.string().min(3).required(),
  address2: yup.string().min(3).nullable(),
  city: yup.string().min(3).required(),
  state: yup.string().min(3).nullable(),
  zip: yup.string().min(3).required(),
  country: yup.string().min(2).max(4).required(),
  phone: yup.string().min(5).nullable(),
});

export const TokenSchema = yup.object().shape({
  id: yup.string().uuid(),
  name: yup.string().min(3).required(),
  secret: yup.string().min(3).required(),
  role: yup.string().min(3).required(),
  created_at: yup.date().nullable(true),
  shop: yup.string().uuid().required(),
});
