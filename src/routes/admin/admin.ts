import { Router } from "../../deps.ts";
import settings from "./settings.ts";
import tokens from "./tokens.ts";

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

export default admin;
