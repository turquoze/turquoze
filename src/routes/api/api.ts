import { Router } from "../../deps.ts";
import products from "./products.ts";
import carts from "./carts.ts";
import orders from "./orders.ts";
import categories from "./categories.ts";
import regions from "./regions.ts";

import {
  CartService,
  CategoryLinkService,
  CategoryService,
  OrderService,
  ProductService,
  RegionService,
} from "../../services/mod.ts";

const api = new Router({
  prefix: "/api",
});

api.use(new products(ProductService).routes());
api.use(new carts(CartService).routes());
api.use(new orders(OrderService).routes());
api.use(new categories(CategoryService, CategoryLinkService).routes());
api.use(new regions(RegionService).routes());
api.allowedMethods();

export default api;
