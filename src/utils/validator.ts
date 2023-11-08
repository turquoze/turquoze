import { yup } from "../deps.ts";
import { object, string, uuid } from "valibot";

export const UuidSchema = object({
  id: string([uuid()]),
});

export const DiscountItemSchema = yup.object().shape({
  code: yup.string().uuid().required(),
});

export const SearchSchema = yup.object().shape({
  query: yup.string().nullable(),
  options: yup.object().nullable(),
});

export const LoginSchema = yup.object().shape({
  email: yup.string().email(),
  password: yup.string().required().min(6),
  shop: yup.string().uuid().required(),
});

export const MetadataSchema = yup.object().shape({
  metadata: yup.object().nullable(),
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
