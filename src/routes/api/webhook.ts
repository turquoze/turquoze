import { Router } from "../../deps.ts";
import Container from "../../services/mod.ts";

import { stringifyJSON } from "../../utils/utils.ts";

export default class WebhookRoutes {
  #webhook: Router;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#webhook = new Router({
      prefix: "/webhook",
    });

    this.#webhook.post("/payment/:id", (ctx) => {
      ctx.response.body = stringifyJSON({
        ok: "test",
      });
      ctx.response.headers.set("content-type", "application/json");
    });
  }

  routes() {
    return this.#webhook.routes();
  }
}
