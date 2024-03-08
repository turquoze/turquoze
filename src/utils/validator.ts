import {
  any,
  email,
  maxLength,
  minLength,
  nullable,
  object,
  string,
  valibot_uuid as uuid,
} from "../deps.ts";

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
