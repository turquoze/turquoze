import RoleGuard from "../../middleware/roleGuard.ts";
import type Container from "../../services/mod.ts";
import { Hono, parse } from "../../deps.ts";

import {
  Delete,
  Get,
  jsonResponse,
  stringifyJSON,
  Update,
} from "../../utils/utils.ts";
import { UuidSchema } from "../../utils/validator.ts";
import { insertWarehouseSchema, Warehouse } from "../../utils/validator.ts";

export default class WarehousesRoutes {
  #warehouses: Hono;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#warehouses = new Hono({ strict: false });

    this.#warehouses.get("/", RoleGuard("VIEWER"), async (ctx) => {
      const offset = parseInt(
        new URL(ctx.req.raw.url).searchParams.get("offset") ?? "",
      );
      const limit = parseInt(
        new URL(ctx.req.raw.url).searchParams.get("limit") ?? "",
      );

      const data = await this.#Container.WarehouseService.GetMany({
        //@ts-expect-error not on type
        shop: ctx.get("request_data").publicId!,
        limit: isNaN(limit) ? undefined : limit,
        offset: isNaN(offset) ? undefined : offset,
      });

      return jsonResponse(
        stringifyJSON({
          warehouses: data,
        }),
        200,
      );
    });

    this.#warehouses.post("/", RoleGuard("VIEWER"), async (ctx) => {
      const warehouse = await ctx.req.json();
      //@ts-expect-error not on type
      warehouse.shop = ctx.get("request_data").publicId!;

      const posted = parse(insertWarehouseSchema, warehouse);

      const data = await this.#Container.WarehouseService.Create({
        data: posted,
      });

      return jsonResponse(
        stringifyJSON({
          warehouses: data,
        }),
        200,
      );
    });

    this.#warehouses.put("/:id", RoleGuard("ADMIN"), async (ctx) => {
      const { id } = parse(UuidSchema, {
        id: ctx.req.param("id"),
      });

      const warehouse = await ctx.req.json();
      //@ts-expect-error not on type
      warehouse.shop = ctx.get("request_data").publicId!;
      warehouse.publicId = id;

      const posted = parse(insertWarehouseSchema, warehouse);

      const data = await Update<Warehouse>(this.#Container, {
        id: `warehouse_${id}`,
        promise: this.#Container.WarehouseService.Update({
          data: posted,
          id: id,
        }),
      });

      return jsonResponse(
        stringifyJSON({
          warehouses: data,
        }),
        200,
      );
    });

    this.#warehouses.get("/:id", RoleGuard("VIEWER"), async (ctx) => {
      const { id } = parse(UuidSchema, {
        id: ctx.req.param("id"),
      });

      const data = await Get<Warehouse>(this.#Container, {
        id: `warehouse_${id}`,
        promise: this.#Container.WarehouseService.Get({
          id: id,
        }),
      });

      return jsonResponse(
        stringifyJSON({
          warehouses: data,
        }),
        200,
      );
    });

    this.#warehouses.delete("/:id", RoleGuard("ADMIN"), async (ctx) => {
      const { id } = parse(UuidSchema, {
        id: ctx.req.param("id"),
      });

      await Delete(this.#Container, {
        id: `warehouse_${id}`,
        promise: this.#Container.WarehouseService.Delete({
          id: id,
        }),
      });

      ctx.res.headers.set("content-type", "application/json");
      return ctx.json({}, 201);
    });
  }

  routes() {
    return this.#warehouses;
  }
}
