export interface Product {
  id: number;
  created_at: number;
  name: string;
  description: string;
}

export interface Cart {
  id: number;
  created_at: number;
  products: Array<{
    pid: string;
    quantity: number;
  }>;
}

export interface Order {
  id: number;
  created_at: number;
  products: Array<{
    product: Product;
    quantity: number;
    price: {
      value: number;
      currency: string;
    };
  }>;
  price: {
    total: number;
    subtotal: number;
  };
}
