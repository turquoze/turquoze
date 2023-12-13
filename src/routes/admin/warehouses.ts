import { Hono } from "hono";
import RoleGuard from "../../middleware/roleGuard.ts";
import type Container from "../../services/mod.ts";
import { ErrorHandler } from "../../utils/errors.ts";

import { Delete, Get, Update } from "../../utils/utils.ts";
import { UuidSchema } from "../../utils/validator.ts";
import { insertWarehouseSchema, Warehouse } from "../../utils/schema.ts";
import { parse } from "valibot";

export default class WarehousesRoutes {
  #warehouses: Hono;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#warehouses = new Hono({ strict: false });

    this.#warehouses.get("/", RoleGuard("VIEWER"), async (ctx) => {
      try {
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

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          warehouses: data,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#warehouses.post("/", RoleGuard("VIEWER"), async (ctx) => {
      try {
        const warehouse = await ctx.req.json();
        //@ts-expect-error not on type
        warehouse.shop = ctx.get("request_data").publicId!;

        const posted = parse(insertWarehouseSchema, warehouse);

        const data = await this.#Container.WarehouseService.Create({
          data: posted,
        });
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          warehouses: data,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#warehouses.put("/:id", RoleGuard("ADMIN"), async (ctx) => {
      try {
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
          }),
        });

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          warehouses: data,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#warehouses.get("/:id", RoleGuard("VIEWER"), async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        const data = await Get<Warehouse>(this.#Container, {
          id: `warehouse_${id}`,
          promise: this.#Container.WarehouseService.Get({
            id: id,
          }),
        });

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          warehouses: data,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#warehouses.delete("/:id", RoleGuard("ADMIN"), async (ctx) => {
      try {
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
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });
  }

  routes() {
    return this.#warehouses;
  }
}
