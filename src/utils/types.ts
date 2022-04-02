export interface Product {
  id: string;
  created_at?: string;
  active: boolean;
  parent?: string;
  title: string;
  description: string;
  images: Array<string>;
  price: number;
  region: string;
}

export interface Cart {
  id: string;
  created_at?: number;
  products: {
    cart: Array<{
      pid: string;
      quantity: number;
    }>;
  };
}

export interface Order {
  id: string;
  region: string;
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
  id: string;
  parent?: string;
  name: string;
  region: string;
}

export interface Region {
  id: string;
  regions: Array<string>;
  currency: string;
  name: string;
}

export interface CategoryLink {
  category: string;
  product: string;
}

export interface TurquozeState {
  region: string;
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
  id: string;
  type: "FIXED" | "PERCENT";
  value: number;
  valid_to: number | null;
  valid_from: number | null;
  region: string;
}

export interface Search {
  query: string;
  limit?: number;
  after?: string;
  region: string;
}
