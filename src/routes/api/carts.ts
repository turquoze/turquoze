import { Router } from "../../deps.ts";

const carts = new Router({
  prefix: "/carts",
});

carts.post("/", (ctx) => {
  ctx.response.body = "create new cart"
});

carts.get("/:id", (ctx) => {
  ctx.response.body = "get cart"
});

carts.put("/:id", (ctx) => {
  ctx.response.body = "update cart"
});

export default carts;
