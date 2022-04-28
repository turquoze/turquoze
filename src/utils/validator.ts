import { yup } from "../deps.ts";

export const ProductSchema = yup.object().shape({
  id: yup.string().uuid(),
  active: yup.bool().required(),
  parent: yup.string().uuid(),
  title: yup.string().min(3).required(),
  description: yup.string().min(3).required(),
  images: yup.array().of(yup.string()),
  price: yup.number().required().positive().integer(),
});

export const RegionSchema = yup.object().shape({
  id: yup.string().uuid(),
  name: yup.string().min(3).required(),
  regions: yup.array().of(yup.string()),
  currency: yup.string().required(),
});

export const CategorySchema = yup.object().shape({
  id: yup.string().uuid(),
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
  id: yup.string().uuid(),
  type: yup.string().matches(/(FIXED|PERCENT)/).required(),
  value: yup.number().required().positive().integer(),
  valid_to: yup.date().nullable(true),
  valid_from: yup.date().nullable(true),
  region: yup.string().uuid().nullable(true),
});

export const CartSchema = yup.object().shape({
  id: yup.string().uuid().nullable(true),
  created_at: yup.date().nullable(true),
  products: yup.object().shape({
    cart: yup.array()
      .of(
        yup.object().shape({
          pid: yup.string(),
          quantity: yup.number().required().positive().integer(),
        }),
      )
      .required(),
  }),
});

export const SearchSchema = yup.object().shape({
  query: yup.string().required(),
  limit: yup.number().positive().integer().nullable(true),
  after: yup.string().uuid().nullable(true),
  region: yup.string().uuid().required(),
});

export const WarehouseSchema = yup.object().shape({
  id: yup.string().uuid().nullable(true),
  created_at: yup.date().nullable(true),
  region: yup.string().uuid().required(),
  name: yup.string().min(3).required(),
  country: yup.string().min(2).required(),
  address: yup.string().min(5).required(),
});

export const InventorySchema = yup.object().shape({
  id: yup.string().uuid().nullable(true),
  created_at: yup.date().nullable(true),
  warehouse: yup.string().uuid().required(),
  product: yup.string().uuid().required(),
  quantity: yup.number().positive().integer().required(),
});

export const PriceSchema = yup.object().shape({
  id: yup.string().uuid(),
  created_at: yup.date().nullable(true),
  amount: yup.number().required().positive().integer(),
  region: yup.string().uuid().required(),
  product: yup.string().uuid().required(),
});

export const DiscountCheckSchema = yup.object().shape({
  code: yup.string().min(3).required(),
});

export const UserSchema = yup.object().shape({
  id: yup.number().positive().integer(),
  system_id: yup.string().nullable().uuid(),
  created_at: yup.date().nullable(true),
  name: yup.string().required().min(3),
  email: yup.string().email(),
  not_active: yup.bool().default(false),
  region: yup.string().uuid().required(),
});
