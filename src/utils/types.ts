import { SearchParams } from "../deps.ts";

export interface Product {
  id: number;
  public_id: string;
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
}

export interface CartItem {
  id: number;
  cart_id: string;
  product_id: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  shop: string;
  created_at: number;
  products: Array<OrderProduct>;
  payment: {
    status: "PAYED" | "WAITING" | "FAILED";
  };
  price: {
    total: number;
    subtotal: number;
  };
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
  payment_id: string;
  currency: string;
  name: string;
  url: string;
}

export interface CategoryLink {
  category: string;
  product: string;
}

export interface TurquozeState {
  shop: string;
  request_data: Shop;
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

export interface PaymentPlugin {
  pay(
    items: Array<CartItem>,
    amount: number,
    shop: Shop,
  ): Promise<PaymentPluginResponse>;
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
  query: string;
  options?: SearchParams;
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
  not_active: boolean;
  shop: string;
}

export interface Token {
  token: string;
  name: string;
  expire: number | null;
  shop: string;
}

export type TurquozeEvent =
  | "CREATED_PRODUCT"
  | "UPDATED_PRODUCT"
  | "DELETED_PRODUCT";
