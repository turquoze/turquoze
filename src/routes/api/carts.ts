import { Router } from "../../deps.ts";
import Container from "../../services/mod.ts";
import { ErrorHandler } from "../../utils/errors.ts";

import { stringifyJSON } from "../../utils/utils.ts";
import { UuidSchema } from "../../utils/validator.ts";

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
            products: {
              cart: [{
                pid: "234",
                quantity: 3,
              }],
            },
          },
        });
        ctx.response.body = stringifyJSON({
          carts: data,
        });
        ctx.response.headers.set("content-type", "application/json");
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.response.status = data.code;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify({
          message: data.message,
        });
      }
    });

    this.#carts.get("/:id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const data = await this.#Container.CartService.Get({
          id: ctx.params.id,
        });
        ctx.response.body = stringifyJSON({
          carts: data,
        });
        ctx.response.headers.set("content-type", "application/json");
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.response.status = data.code;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify({
          message: data.message,
        });
      }
    });

    this.#carts.delete("/:id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        await this.#Container.CartService.Delete({
          id: ctx.params.id,
        });
        ctx.response.status = 201;
        ctx.response.headers.set("content-type", "application/json");
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.response.status = data.code;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify({
          message: data.message,
        });
      }
    });
  }

  routes() {
    return this.#carts.routes();
  }
}
