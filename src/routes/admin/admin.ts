import { Router } from "../../deps.ts";
import settings from "./settings.ts";

const admin = new Router({
  prefix: "/admin",
});

admin.use(settings.routes());
admin.allowedMethods();

export default admin;
