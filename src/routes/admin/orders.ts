import RoleGuard from "../../middleware/roleGuard.ts";
import type Container from "../../services/mod.ts";
import { Hono, parse } from "../../deps.ts";

import { Get, jsonResponse, stringifyJSON } from "../../utils/utils.ts";
import { UuidSchema } from "../../utils/validator.ts";

export default class OrdersRoutes {
  #orders: Hono;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#orders = new Hono({ strict: false });

    this.#orders.use(RoleGuard("VIEWER"));

    this.#orders.get("/", async (ctx) => {
      const offset = parseInt(
        new URL(ctx.req.url).searchParams.get("offset") ?? "",
      );
      const limit = parseInt(
        new URL(ctx.req.url).searchParams.get("limit") ?? "",
      );

      const data = await this.#Container.OrderService.GetMany({
        //@ts-expect-error not on type
        shop: ctx.get("request_data").publicId,
        limit: isNaN(limit) ? undefined : limit,
        offset: isNaN(offset) ? undefined : offset,
      });

      return jsonResponse(
        stringifyJSON({
          orders: data,
        }),
        200,
      );
    });

    this.#orders.get("/:id", async (ctx) => {
      const { id } = parse(UuidSchema, {
        id: ctx.req.param("id"),
      });

      const data = await Get(this.#Container, {
        id: `order_${id}`,
        promise: this.#Container.OrderService.Get({
          id: id,
        }),
      });

      return jsonResponse(
        stringifyJSON({
          orders: data,
        }),
        200,
      );
    });
  }

  routes() {
    return this.#orders;
  }
}
