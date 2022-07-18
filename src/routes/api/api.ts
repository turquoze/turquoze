import { Router } from "../../deps.ts";
import products from "./products.ts";
import carts from "./carts.ts";
import orders from "./orders.ts";
import categories from "./categories.ts";
import shops from "./shops.ts";
import webhook from "./webhook.ts";
import discounts from "./discounts.ts";
import warehouses from "./warehouses.ts";
import inventories from "./inventories.ts";

import container from "../../services/mod.ts";

const api = new Router({
  prefix: "/api",
});

api.use(new products(container).routes());
api.use(new carts(container).routes());
api.use(new orders(container).routes());
api.use(new categories(container).routes());
api.use(new shops(container).routes());
api.use(new webhook(container).routes());
api.use(new discounts(container).routes());
api.use(new warehouses(container).routes());
api.use(new inventories(container).routes());
api.allowedMethods();

export default api;
