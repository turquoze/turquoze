import { Router } from "../../deps.ts";
import products from "./products.ts";
import carts from "./carts.ts";
import categories from "./categories.ts";
import users from "./users.ts";

import container from "../../services/mod.ts";
import AuthGuard from "../../middleware/authGuard.ts";

const api = new Router({
  prefix: "/api",
});

api.use(AuthGuard(container));

api.use(new products(container).routes());
api.use(new carts(container).routes());
api.use(new categories(container).routes());
api.use(new users(container).routes());

export default api;
