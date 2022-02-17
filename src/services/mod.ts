import ProductService from "./productService/mod.ts";
import DefaultCartService from "./cartService/mod.ts";

export const DataService: ProductService = new ProductService();
export const CartService: DefaultCartService = new DefaultCartService();
