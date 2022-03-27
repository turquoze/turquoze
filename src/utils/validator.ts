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
