import { Router } from "../../deps.ts";

import { CartService } from "../../services/mod.ts";
import { stringifyJSON } from "../../utils/utils.ts";

const carts = new Router({
  prefix: "/carts",
});

carts.post("/", async (ctx) => {
  try {
    const data = await CartService.Create({
      data: {
        id: 1,
        created_at: new Date().getUTCDate(),
        products: [{
          pid: "234",
          quantity: 3,
        }],
      },
    });
    ctx.response.body = stringifyJSON({
      carts: data,
    });
  } catch (error) {
    ctx.response.body = JSON.stringify(error);
  }
});

carts.get("/:id", async (ctx) => {
  try {
    const data = await CartService.Get({ id: ctx.params.id });
    ctx.response.body = stringifyJSON({
      carts: data,
    });
  } catch (error) {
    ctx.response.body = JSON.stringify(error);
  }
});

carts.put("/:id", async (ctx) => {
  try {
    const data = await CartService.Update({
      data: {
        id: parseInt(ctx.params.id),
        created_at: new Date().getUTCDate(),
        products: [{
          pid: "234",
          quantity: 3,
        }],
      },
    });
    ctx.response.body = stringifyJSON({
      carts: data,
    });
  } catch (error) {
    ctx.response.body = JSON.stringify(error);
  }
});

export default carts;
