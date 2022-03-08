import ProductService from "./productService/mod.ts";
import DefaultCartService from "./cartService/mod.ts";
import DefaultOrderService from "./orderService/mod.ts";
import DefaultCategoryService from "./categoryService/mod.ts";
import DefaultCategoryLinkService from "./categoryLinkService/mod.ts";

export const DataService: ProductService = new ProductService();
export const CartService: DefaultCartService = new DefaultCartService();
export const OrderService: DefaultOrderService = new DefaultOrderService();
export const CategoryService: DefaultCategoryService =
  new DefaultCategoryService();
export const CategoryLinkService: DefaultCategoryLinkService =
  new DefaultCategoryLinkService();
