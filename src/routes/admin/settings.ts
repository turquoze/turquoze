import { Router } from "../../deps.ts";

const settings = new Router({
  prefix: "settings",
});

settings.get("/", (ctx) => {
  ctx.response.body = "Admin settings";
});

export default settings;
