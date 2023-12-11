import { Hono } from "hono";
import settings from "./settings.ts";
import tokens from "./tokens.ts";
import discounts from "./discounts.ts";
import shops from "./shops.ts";
import warehouses from "./warehouses.ts";
import inventories from "./inventories.ts";
import orders from "./orders.ts";
import prices from "./prices.ts";
import users from "./users.ts";
import categories from "./categories.ts";
import products from "./products.ts";
import auth from "./auth.ts";
import dashboard from "./dashboard.ts";
import OAuth from "./oauth.ts";
import AuthGuard from "../../middleware/authGuard.ts";
import Container from "../../services/mod.ts";

function admin(container: Container) {
  const _admin = new Hono();

  _admin.route("/oauth", new OAuth(container).routes());
  _admin.route("/auth", new auth(container).routes());
  _admin.route("/dashboard", new dashboard(container).routes());

  _admin.use(AuthGuard(container));

  _admin.route("/settings", new settings(container).routes());
  _admin.route("/tokens", new tokens(container).routes());
  _admin.route("/discounts", new discounts(container).routes());
  _admin.route("/shops", new shops(container).routes());
  _admin.route("/warehouses", new warehouses(container).routes());
  _admin.route("/inventories", new inventories(container).routes());
  _admin.route("/orders", new orders(container).routes());
  _admin.route("/prices", new prices(container).routes());
  _admin.route("/users", new users(container).routes());
  _admin.route("/categories", new categories(container).routes());
  _admin.route("/products", new products(container).routes());

  return _admin;
}

export default admin;
