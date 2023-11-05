import type { SearchParams } from "meilisearch";
import Container from "../services/mod.ts";
import * as jose from "jose";

export interface Product {
  id: number;
  publicId?: string;
  createdAt?: string;
  slug: string;
  active: boolean;
  parent?: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  images: Array<string>;
  price?: number;
  shop: string;
}

export interface Cart {
  id: number;
  publicId: string;
  createdAt?: number;
  items: Array<CartItem>;
  metadata: Record<string, unknown>;
  shipping: Shipping;
  billing: Shipping;
  coupon: string;
  giftcard: string;
  comment: string;
}

export interface CartItem {
  id: number;
  cartId: string;
  itemId: string;
  price: number;
  quantity: number;
  totalPrice: number;
  type: "PRODUCT" | "DISCOUNT";
}

export interface DiscountItem {
  code: string;
}

export interface Order {
  publicId: string;
  id: number;
  shop: string;
  createdAt: number;
  products: Array<OrderProduct>;
  payment_status: "PAYED" | "WAITING" | "FAILED";
  price_total: number;
  exported: boolean;
}

export interface OrderProduct {
  product: string;
  quantity: number;
  price: {
    value: number;
    currency: string;
  };
}

export interface Category {
  id: number;
  publicId: string;
  parent?: string;
  name: string;
  shop: string;
}

export interface Shop {
  id: number;
  publicId: string;
  regions: Array<string>;
  paymentId?: string;
  shippingId?: string;
  currency: string;
  name: string;
  url: string;
  search_index: string;
  secret: string;
  settings: Settings;
  _signKey: Uint8Array | jose.KeyLike;
  _role: TurquozeRole;
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

export interface CategoryLink {
  category: string;
  product: string;
}

export interface ShopLink {
  id: number;
  admin: string;
  shop: string;
  role: TurquozeRole;
  createdAt?: number;
}

export interface TurquozeState {
  shop: string;
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
  code: number;
  message: string;
}

export interface Discount {
  id: number;
  publicId: string;
  type: "FIXED" | "PERCENT";
  value: number;
  validTo: number | null;
  validFrom: number | null;
  shop: string;
  code: string;
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

export interface Warehouse {
  id: number;
  publicId: string;
  shop: string;
  createdAt?: number;
  country: string;
  address: string;
  name: string;
}

export interface Inventory {
  id: number;
  publicId: string;
  createdAt?: number;
  warehouse: string;
  product: string;
  quantity: number;
  warehouse_name?: string;
}

export interface PriceCalculation {
  vat: number;
  price: number;
  subtotal: number;
}

export interface Price {
  id: number;
  publicId: string;
  createdAt?: number;
  amount: number;
  shop: string;
  product: string;
  list?: string;
}

export interface DiscountCheck {
  code: string;
}

export interface User {
  id: number;
  publicId: string;
  createdAt?: number;
  name: string;
  email: string;
  password: string;
  not_active: boolean;
  role: string;
  shop: string;
}

export interface Admin {
  id: number;
  publicId: string;
  createdAt?: number;
  name: string;
  email: string;
  password: string;
  not_active: boolean;
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

export interface Token {
  id: string;
  name: string;
  secret: string;
  role: string;
  createdAt?: number;
  shop: string;
}

export interface Tax {
  id: number;
  publicId: string;
  createdAt?: number;
  type: "Inclusive" | "Exclusive";
  name: string;
  value: number;
  shop: string;
}

export interface TaxProductLink {
  taxId: string;
  country: string;
  productId: string;
}

export interface Media {
  file:
    | ArrayBuffer
    | ArrayBufferView
    | Blob
    | Buffer
    | File
    | FormData
    | ReadableStream
    | ReadableStream
    | URLSearchParams
    | string;
  name: string;
  public: boolean;
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

export interface Plugin {
  id: number;
  publicId: string;
  createdAt?: string;
  name: string;
  url: string;
  type: "PAYMENT" | "SHIPPING" | "MISC";
  shop: string;
  token: string;
}

export interface OauthToken {
  shopId: string;
  adminId: string;
}

export interface Oauth {
  id: number;
  createdAt?: number;
  publicId: string;
  token: string;
  expiresAt?: number | null;
  plugin: string;
}

export interface Organization {
  id: number;
  publicId: string;
  name: string;
}

export interface OrganizationLink {
  id: number;
  person: string;
  shop: string;
  role: TurquozeRole;
  createdAt?: number;
}
