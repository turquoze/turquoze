import { Router } from "../../deps.ts";
import Container from "../../services/mod.ts";

import { stringifyJSON } from "../../utils/utils.ts";

export default class OrdersRoutes {
  #orders: Router;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#orders = new Router({
      prefix: "/orders",
    });

    this.#orders.get("/", async (ctx) => {
      try {
        const data = await this.#Container.OrderService.GetMany({});
        ctx.response.body = stringifyJSON({
          orders: data,
        });
        ctx.response.headers.set("content-type", "application/json");
      } catch (error) {
        ctx.response.status = 400;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify(error);
      }
    });

    this.#orders.get("/:id", async (ctx) => {
      try {
        const data = await this.#Container.OrderService.Get({
          id: ctx.params.id,
        });
        ctx.response.body = stringifyJSON({
          orders: data,
        });
        ctx.response.headers.set("content-type", "application/json");
      } catch (error) {
        ctx.response.status = 400;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify(error);
      }
    });
  }

  routes() {
    return this.#orders.routes();
  }
}
