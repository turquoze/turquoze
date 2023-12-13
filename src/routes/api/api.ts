import { Hono } from "hono";
import products from "./products.ts";
import carts from "./carts.ts";
import categories from "./categories.ts";
import users from "./users.ts";
import AuthGuard from "../../middleware/authGuard.ts";
import RoleGuard from "../../middleware/roleGuard.ts";
import Container from "../../services/mod.ts";

function api(container: Container) {
  const _api = new Hono({ strict: false });

  _api.use("*", AuthGuard(container));
  _api.use("*", RoleGuard("WEBSITE"));
  _api.route("/products", new products(container).routes());
  _api.route("/carts", new carts(container).routes());
  _api.route("/categories", new categories(container).routes());
  _api.route("/users", new users(container).routes());

  return _api;
}

export default api;
