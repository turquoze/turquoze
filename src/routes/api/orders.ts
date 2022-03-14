import { Router } from "../../deps.ts";
import IOrderService from "../../services/interfaces/orderService.ts";

import { stringifyJSON } from "../../utils/utils.ts";

export default class OrdersRoutes {
  #orders: Router;
  #OrderService: IOrderService;
  constructor(orderService: IOrderService) {
    this.#OrderService = orderService;
    this.#orders = new Router({
      prefix: "/orders",
    });

    this.#orders.get("/", async (ctx) => {
      try {
        const data = await this.#OrderService.GetMany({});
        ctx.response.body = stringifyJSON({
          orders: data,
        });
      } catch (error) {
        ctx.response.body = JSON.stringify(error);
      }
    });

    this.#orders.get("/:id", async (ctx) => {
      try {
        const data = await this.#OrderService.Get({ id: ctx.params.id });
        ctx.response.body = stringifyJSON({
          orders: data,
        });
      } catch (error) {
        ctx.response.body = JSON.stringify(error);
      }
    });
  }

  routes() {
    return this.#orders.routes();
  }
}
