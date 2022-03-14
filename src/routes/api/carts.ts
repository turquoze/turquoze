import { Router } from "../../deps.ts";
import ICartService from "../../services/interfaces/cartService.ts";

import { stringifyJSON } from "../../utils/utils.ts";

export default class CartRoutes {
  #carts: Router;
  #CartService: ICartService;
  constructor(cartService: ICartService) {
    this.#CartService = cartService;
    this.#carts = new Router({
      prefix: "/carts",
    });

    this.#carts.post("/", async (ctx) => {
      try {
        const data = await this.#CartService.Create({
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

    this.#carts.get("/:id", async (ctx) => {
      try {
        const data = await this.#CartService.Get({ id: ctx.params.id });
        ctx.response.body = stringifyJSON({
          carts: data,
        });
      } catch (error) {
        ctx.response.body = JSON.stringify(error);
      }
    });

    this.#carts.put("/:id", async (ctx) => {
      try {
        const data = await this.#CartService.Update({
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
  }

  routes() {
    return this.#carts.routes();
  }
}
