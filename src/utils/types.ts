export interface Product {
  id: number;
  public_id: string;
  created_at?: string;
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
  products: {
    cart: Array<{
      pid: string;
      quantity: number;
    }>;
  };
  discounts: {
    cart: Array<{
      did: string;
    }>;
  };
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

export interface Region {
  id: number;
  public_id: string;
  regions: Array<string>;
  currency: string;
  name: string;
}

export interface CategoryLink {
  category: string;
  product: string;
}

export interface TurquozeState {
  shop: string;
}

export interface PaymentRequest {
  id: string;
  cartId: string;
  customerId?: string;
  info?: {
    country: string;
    type: "COMPANY" | "PERSONAL" | "UNKNOWN";
    data: Record<string, string>;
  };
}

export interface PaymentValidation {
  orderId: string;
  status: "PAYED" | "WAITING" | "FAILED";
}

export interface PaymentRequestResponse {
  id: string;
  data: unknown;
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
  limit?: number;
  after?: string;
  shop: string;
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
