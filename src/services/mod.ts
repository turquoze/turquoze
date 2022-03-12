import DefaultProductService from "./productService/mod.ts";
import DefaultCartService from "./cartService/mod.ts";
import DefaultOrderService from "./orderService/mod.ts";
import DefaultCategoryService from "./categoryService/mod.ts";
import DefaultCategoryLinkService from "./categoryLinkService/mod.ts";
import DefaultRegionService from "./regionService/mod.ts";

import IProductService from "./interfaces/productService.ts";
import ICartService from "./interfaces/cartService.ts";
import IOrderService from "./interfaces/orderService.ts";
import ICategoryService from "./interfaces/categoryService.ts";
import ICategoryLinkService from "./interfaces/categoryLinkService.ts";
import IRegionService from "./interfaces/regionService.ts";

export const ProductService: IProductService = new DefaultProductService();
export const CartService: ICartService = new DefaultCartService();
export const OrderService: IOrderService = new DefaultOrderService();
export const CategoryService: ICategoryService = new DefaultCategoryService();
export const CategoryLinkService: ICategoryLinkService =
  new DefaultCategoryLinkService();
export const RegionService: IRegionService = new DefaultRegionService();
