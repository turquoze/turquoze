import { StatusCode } from "@hono/hono/utils/http-status";
import type { SearchParams } from "../deps.ts";
import Container from "../services/mod.ts";
import type { Product, Shop } from "./validator.ts";

export interface DiscountItem {
  code: string;
}

export interface ShopLinkData extends Shop {
  role: TurquozeRole;
}

export interface Settings {
  meilisearch: {
    index: string;
    api_key: string;
    host: string;
  };
}

export interface TurquozeState {
  request_data: Shop;
  container: Container;
  adminId?: string;
}

export interface PaymentRequest {
  id: string;
  cartId: string;
  customerId?: string;
  shop: Shop;
  info?: {
    country: string;
    type: "COMPANY" | "PERSONAL" | "UNKNOWN";
    data: Record<string, string>;
  };
}

export interface PaymentPluginResponse {
  type: "URL" | "CODE";
  value: string;
}

export interface PaymentValidation {
  orderId: string;
  status: "PAYED" | "WAITING" | "FAILED";
}

export interface PaymentRequestResponse {
  id: string;
  data: unknown;
  payment: PaymentPluginResponse;
}

export interface ErrorResponse {
  code: StatusCode;
  message: string;
}

export interface Search {
  index: string;
  query: string;
  options?: SearchParams;
}

export interface MeiliIndex {
  products: Array<Product>;
  index: string;
}

export interface MeiliDelete {
  id: string;
  index: string;
}

export interface PriceCalculation {
  vat: number;
  price: number;
  subtotal: number;
}

export interface DiscountCheck {
  code: string;
}

export interface Shipping {
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  shop: string;
}

export interface OrderReturn {
  publicId: string;
  id: number;
  orderId: string;
  shop: string;
  createdAt: number;
  items: Array<ReturnProduct>;
  status: "INIT" | "WAITING" | "RETURNED" | "FAILED";
  exported: boolean;
}

export interface ReturnProduct {
  quantity: number;
  quantity_returned: number;
  productId: string;
}

export type TurquozeEvent =
  | "Order.Created"
  | "Order.Done"
  | "Order.Cancelled"
  | "Product.Created"
  | "Product.Updated"
  | "Product.Deleted"
  | "Category.Created"
  | "Category.Updated"
  | "Category.Deleted"
  | "Discount.Created"
  | "Discount.Updated"
  | "Discount.Deleted"
  | "Inventory.Created"
  | "Inventory.Updated"
  | "Inventory.Deleted"
  | "Price.Created"
  | "Price.Updated"
  | "Price.Deleted"
  | "TEST_EVENT";

export type TurquozeRole =
  | "SUPERADMIN"
  | "ADMIN"
  | "WEBSITE"
  | "VIEWER"
  | "USER";

export interface Oauth {
  id: number;
  createdAt?: number;
  publicId: string;
  token: string;
  expiresAt?: number | null;
  plugin: string;
}
