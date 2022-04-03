import { Router } from "../../deps.ts";
import products from "./products.ts";
import carts from "./carts.ts";
import orders from "./orders.ts";
import categories from "./categories.ts";
import regions from "./regions.ts";
import webhook from "./webhook.ts";
import discounts from "./discounts.ts";
import warehouses from "./warehouses.ts";

import Container from "../../services/mod.ts";

const api = new Router({
  prefix: "/api",
});

const container = new Container();

api.use(new products(container).routes());
api.use(new carts(container).routes());
api.use(new orders(container).routes());
api.use(new categories(container).routes());
api.use(new regions(container).routes());
api.use(new webhook(container).routes());
api.use(new discounts(container).routes());
api.use(new warehouses(container).routes());
api.allowedMethods();

export default api;
