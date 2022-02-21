import { Router } from "../../deps.ts";

import { OrderService } from "../../services/mod.ts";
import { stringifyJSON } from "../../utils/utils.ts";

const orders = new Router({
  prefix: "/orders",
});

orders.get("/", async (ctx) => {
  try {
    const data = await OrderService.GetMany({});
    ctx.response.body = stringifyJSON({
      orders: data,
    });
  } catch (error) {
    ctx.response.body = JSON.stringify(error);
  }
});

orders.get("/:id", async (ctx) => {
  try {
    const data = await OrderService.Get({ id: ctx.params.id });
    ctx.response.body = stringifyJSON({
      orders: data,
    });
  } catch (error) {
    ctx.response.body = JSON.stringify(error);
  }
});

export default orders;
