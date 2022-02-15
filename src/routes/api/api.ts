import { Router } from "../../deps.ts";
import products from "./products.ts";
import carts from "./carts.ts";

const api = new Router({
  prefix: "/api",
});

api.use(products.routes());
api.use(carts.routes());
api.allowedMethods();

export default api;
