import { Router } from "../../deps.ts";
import Container from "../../services/mod.ts";
import { ErrorHandler } from "../../utils/errors.ts";
import { TurquozeState } from "../../utils/types.ts";

import { Get, stringifyJSON } from "../../utils/utils.ts";
import { UuidSchema } from "../../utils/validator.ts";

export default class OrdersRoutes {
  #orders: Router<TurquozeState>;
  #Container: typeof Container;
  constructor(container: typeof Container) {
    this.#Container = container;
    this.#orders = new Router<TurquozeState>({
      prefix: "/orders",
    });

    this.#orders.get("/", async (ctx) => {
      try {
        const data = await Get({
          id: `ordersGetMany-${10}-${undefined}`,
          promise: this.#Container.OrderService.GetMany({}),
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

        const data = await Get({
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
