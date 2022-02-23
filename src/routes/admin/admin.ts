import { Router } from "../../deps.ts";
import settings from "./settings.ts";

import AuthGuard from "../../middleware/authGuard.ts";

const admin = new Router({
  prefix: "/admin",
});

admin.use(AuthGuard);

admin.use(settings.routes());
admin.allowedMethods();

export default admin;
