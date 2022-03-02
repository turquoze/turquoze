import { Router } from "../../deps.ts";
import products from "./products.ts";
import carts from "./carts.ts";
import orders from "./orders.ts";
import categories from "./categories.ts";

const api = new Router({
  prefix: "/api",
});

api.use(products.routes());
api.use(carts.routes());
api.use(orders.routes());
api.use(categories.routes());
api.allowedMethods();

export default api;
