import { Router } from "../../deps.ts";
import settings from "./settings.ts";
import tokens from "./tokens.ts";

import container from "../../services/mod.ts";
import AuthGuard from "../../middleware/authGuard.ts";
import ApplicationState from "../../middleware/applicationState.ts";

const admin = new Router({
  prefix: "/admin",
});

admin.use(AuthGuard(container.TokenService));
admin.use(ApplicationState(container.ShopService));

admin.use(settings.routes());
admin.use(tokens.routes());
admin.allowedMethods();

export default admin;
