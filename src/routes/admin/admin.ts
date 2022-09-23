import { Router } from "../../deps.ts";
import settings from "./settings.ts";
import tokens from "./tokens.ts";
import discounts from "./discounts.ts";
import shops from "./shops.ts";
import warehouses from "./warehouses.ts";

import container from "../../services/mod.ts";
import AuthGuard from "../../middleware/authGuard.ts";
import ApplicationState from "../../middleware/applicationState.ts";

const admin = new Router({
  prefix: "/admin",
});

admin.use(AuthGuard(container));
admin.use(ApplicationState(container));

admin.use(settings.routes());
admin.use(tokens.routes());
admin.use(new discounts(container).routes());
admin.use(new shops(container).routes());
admin.use(new warehouses(container).routes());

export default admin;
