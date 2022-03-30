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
