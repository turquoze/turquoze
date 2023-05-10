import { jose, SearchParams } from "../deps.ts";
import Container from "../services/mod.ts";

export interface Product {
  id: number;
  public_id?: string;
  created_at?: string;
  slug: string;
  active: boolean;
  parent?: string;
  title: string;
  short_description: string;
  long_description: string;
  images: Array<string>;
  price: number;
  shop: string;
}

export interface Cart {
  id: number;
  public_id: string;
  created_at?: number;
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
  cart_id: string;
  product_id: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  public_id: string;
  id: number;
  shop: string;
  created_at: number;
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
  public_id: string;
  parent?: string;
  name: string;
  shop: string;
}

export interface Shop {
  id: number;
  public_id: string;
  regions: Array<string>;
  payment_id?: string;
  shipping_id?: string;
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
  created_at?: number;
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
  public_id: string;
  type: "FIXED" | "PERCENT";
  value: number;
  valid_to: number | null;
  valid_from: number | null;
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
  public_id: string;
  shop: string;
  created_at?: number;
  country: string;
  address: string;
  name: string;
}

export interface Inventory {
  id: number;
  public_id: string;
  created_at?: number;
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
  public_id: string;
  created_at?: number;
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
  public_id: string;
  created_at?: number;
  name: string;
  email: string;
  password: string;
  not_active: boolean;
  role: string;
  shop: string;
}

export interface Admin {
  id: number;
  public_id: string;
  created_at?: number;
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
  created_at?: number;
  shop: string;
}

export interface Tax {
  id: number;
  public_id: string;
  created_at?: number;
  type: "Inclusive" | "Exclusive";
  name: string;
  value: number;
  shop: string;
}

export interface TaxProductLink {
  tax_id: string;
  country: string;
  product_id: string;
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
  public_id: string;
  id: number;
  order_id: string;
  shop: string;
  created_at: number;
  items: Array<ReturnProduct>;
  status: "INIT" | "WAITING" | "RETURNED" | "FAILED";
  exported: boolean;
}

export interface ReturnProduct {
  quantity: number;
  quantity_returned: number;
  product_id: string;
}

export type TurquozeEvent =
  | "CREATED_PRODUCT"
  | "UPDATED_PRODUCT"
  | "DELETED_PRODUCT"
  | "TEST_EVENT";

export type TurquozeRole =
  | "SUPERADMIN"
  | "ADMIN"
  | "WEBSITE"
  | "VIEWER"
  | "USER";

export interface Plugin {
  id: number;
  public_id: string;
  created_at?: string;
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
  created_at?: number;
  public_id: string;
  token: string;
  expires_at?: number | null;
  plugin: string;
}
