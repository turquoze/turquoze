import { Router } from "../../deps.ts";
import products from "./products.ts";
import carts from "./carts.ts";
import categories from "./categories.ts";
import users from "./users.ts";
import AuthGuard from "../../middleware/authGuard.ts";
import app from "../../app.ts";
import RoleGuard from "../../middleware/roleGuard.ts";

const api = new Router({
  prefix: "/api",
});

api.use(AuthGuard(app.state.container));
api.use(RoleGuard("WEBSITE"));

api.use(new products(app.state.container).routes());
api.use(new carts(app.state.container).routes());
api.use(new categories(app.state.container).routes());
api.use(new users(app.state.container).routes());

export default api;
