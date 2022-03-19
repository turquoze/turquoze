import { Router } from "../../deps.ts";
import IOrderService from "../../services/interfaces/orderService.ts";

import { stringifyJSON } from "../../utils/utils.ts";

export default class WebhookRoutes {
  #webhook: Router;
  #OrderService: IOrderService;
  constructor(orderService: IOrderService) {
    this.#OrderService = orderService;
    this.#webhook = new Router({
      prefix: "/webhook",
    });

    this.#webhook.post("/payment/:id", (ctx) => {
      ctx.response.body = stringifyJSON({
        ok: "test",
      });
    });
  }

  routes() {
    return this.#webhook.routes();
  }
}
