import { Router } from "../../deps.ts";
import settings from "./settings.ts";
import tokens from "./tokens.ts";

const admin = new Router({
  prefix: "/admin",
});

admin.use(settings.routes());
admin.use(tokens.routes());
admin.allowedMethods();

export default admin;
