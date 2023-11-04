import { Router } from "../../deps.ts";
import RoleGuard from "../../middleware/roleGuard.ts";
import type Container from "../../services/mod.ts";
import { ErrorHandler } from "../../utils/errors.ts";
import { TurquozeState } from "../../utils/types.ts";

import { Get, stringifyJSON } from "../../utils/utils.ts";
import { UuidSchema } from "../../utils/validator.ts";

export default class OrdersRoutes {
  #orders: Router<TurquozeState>;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#orders = new Router<TurquozeState>({
      prefix: "/orders",
    });

    this.#orders.use(RoleGuard("VIEWER"));

    this.#orders.get("/", async (ctx) => {
      try {
        const data = await this.#Container.OrderService.GetMany({
          shop: ctx.state.request_data.publicId,
        });

        ctx.response.body = stringifyJSON({
          orders: data,
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

    this.#orders.get("/:id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const data = await Get(this.#Container, {
          id: `order_${ctx.params.id}`,
          promise: this.#Container.OrderService.Get({
            id: ctx.params.id,
          }),
        });

        ctx.response.body = stringifyJSON({
          orders: data,
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
  }

  routes() {
    return this.#orders.routes();
  }
}
