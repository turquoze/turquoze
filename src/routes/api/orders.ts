import { Router } from "../../deps.ts";

const orders = new Router({
  prefix: "/orders",
});

orders.get("/", (ctx) => {
  ctx.response.body = "get orders";
});

orders.get("/:id", (ctx) => {
  ctx.response.body = "get order";
});

orders.post("/:id/cancel", (ctx) => {
  ctx.response.body = "cancel orders";
});

export default orders;
