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
import AuthGuard from "../../middleware/authGuard.ts";
import app from "../../app.ts";
import RoleGuard from "../../middleware/roleGuard.ts";

const admin = new Router({
  prefix: "/admin",
});

admin.use(AuthGuard(app.state.container));
admin.use(RoleGuard("ADMIN"));

admin.use(settings.routes());
admin.use(tokens.routes());
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
