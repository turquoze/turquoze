import { Router } from "../../deps.ts";

const tokens = new Router({
  prefix: "tokens",
});

tokens.get("/", (ctx) => {
  ctx.response.body = "Admin settings";
});

export default tokens;
