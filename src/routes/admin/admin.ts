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

import container from "../../services/mod.ts";
import AuthGuard from "../../middleware/authGuard.ts";

const admin = new Router({
  prefix: "/admin",
});

admin.use(AuthGuard(container));

admin.use(settings.routes());
admin.use(tokens.routes());
admin.use(new discounts(container).routes());
admin.use(new shops(container).routes());
admin.use(new warehouses(container).routes());
admin.use(new inventories(container).routes());
admin.use(new orders(container).routes());
admin.use(new prices(container).routes());
admin.use(new users(container).routes());
admin.use(new categories(container).routes());

export default admin;
