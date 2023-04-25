import { Router } from "../../deps.ts";
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
import app from "../../app.ts";

const admin = new Router({
  prefix: "/admin",
});

admin.use(new OAuth(app.state.container).routes());
admin.use(new auth(app.state.container).routes());
admin.use(new dashboard(app.state.container).routes());

admin.use(AuthGuard(app.state.container));

admin.use(new settings(app.state.container).routes());
admin.use(new tokens(app.state.container).routes());
admin.use(new discounts(app.state.container).routes());
admin.use(new shops(app.state.container).routes());
admin.use(new warehouses(app.state.container).routes());
admin.use(new inventories(app.state.container).routes());
admin.use(new orders(app.state.container).routes());
admin.use(new prices(app.state.container).routes());
admin.use(new users(app.state.container).routes());
admin.use(new categories(app.state.container).routes());
admin.use(new products(app.state.container).routes());

export default admin;
