import { Router } from "../../deps.ts";
import products from "./products.ts";
import carts from "./carts.ts";
import orders from "./orders.ts";
import categories from "./categories.ts";
import inventories from "./inventories.ts";

import container from "../../services/mod.ts";
import AuthGuard from "../../middleware/authGuard.ts";
import ApplicationState from "../../middleware/applicationState.ts";

const api = new Router({
  prefix: "/api",
});

api.use(AuthGuard(container));
api.use(ApplicationState(container));

api.use(new products(container).routes());
api.use(new carts(container).routes());
api.use(new orders(container).routes());
api.use(new categories(container).routes());
api.use(new inventories(container).routes());

export default api;
