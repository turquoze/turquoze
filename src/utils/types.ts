export interface Product {
  id: string;
  created_at?: string;
  active: boolean;
  parent?: string;
  title: string;
  description: string;
  images: Array<string>;
  price: number;
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

export interface Category {
  id: number;
  parent: string;
  name: string;
}

export interface CategoryLink {
  category: string;
  product: string;
}
