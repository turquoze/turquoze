import { Router } from "../../deps.ts";
import Container from "../../services/mod.ts";

import { stringifyJSON } from "../../utils/utils.ts";

export default class CartRoutes {
  #carts: Router;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#carts = new Router({
      prefix: "/carts",
    });

    this.#carts.post("/", async (ctx) => {
      try {
        const data = await this.#Container.CartService.CreateOrUpdate({
          data: {
            id: "",
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
        ctx.response.status = 400;
        ctx.response.body = JSON.stringify(error);
      }
    });

    this.#carts.get("/:id", async (ctx) => {
      try {
        const data = await this.#Container.CartService.Get({
          id: ctx.params.id,
        });
        ctx.response.body = stringifyJSON({
          carts: data,
        });
      } catch (error) {
        ctx.response.status = 400;
        ctx.response.body = JSON.stringify(error);
      }
    });

    this.#carts.delete("/:id", async (ctx) => {
      try {
        await this.#Container.CartService.Delete({
          id: ctx.params.id,
        });
        ctx.response.status = 201;
      } catch (error) {
        ctx.response.status = 400;
        ctx.response.body = JSON.stringify(error);
      }
    });
  }

  routes() {
    return this.#carts.routes();
  }
}
