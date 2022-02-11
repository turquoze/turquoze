import { Router } from "../../deps.ts";
import products from "./products.ts";

const api = new Router({
  prefix: "/api",
});

api.use(products.routes());
api.allowedMethods();

export default api;
