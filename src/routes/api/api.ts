import { Router } from "../../deps.ts";
import products from "./products.ts";
import carts from "./carts.ts";
import orders from "./orders.ts";

const api = new Router({
  prefix: "/api",
});

api.use(products.routes());
api.use(carts.routes());
api.use(orders.routes());
api.allowedMethods();

export default api;
