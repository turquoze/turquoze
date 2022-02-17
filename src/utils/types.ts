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
