import { Router } from "@oakserver/oak";
import RoleGuard from "../../middleware/roleGuard.ts";
import type Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";

import { Delete, Get, stringifyJSON, Update } from "../../utils/utils.ts";
import { UuidSchema } from "../../utils/validator.ts";
import { insertWarehouseSchema, Warehouse } from "../../utils/schema.ts";
import { parse } from "valibot";

export default class WarehousesRoutes {
  #warehouses: Router;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#warehouses = new Router({
      prefix: "/warehouses",
    });

    this.#warehouses.get("/", RoleGuard("VIEWER"), async (ctx) => {
      try {
        const offset = parseInt(
          ctx.request.url.searchParams.get("offset") ?? "",
        );
        const limit = parseInt(ctx.request.url.searchParams.get("limit") ?? "");

        const data = await this.#Container.WarehouseService.GetMany({
          shop: ctx.state.request_data.publicId,
          limit: isNaN(limit) ? undefined : limit,
          offset: isNaN(offset) ? undefined : offset,
        });

        ctx.response.body = stringifyJSON({
          warehouses: data,
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

    this.#warehouses.post("/", RoleGuard("VIEWER"), async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const body = ctx.request.body();
        let warehouse: Warehouse;
        if (body.type === "json") {
          warehouse = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        warehouse.shop = ctx.state.request_data.publicId;

        const posted = parse(insertWarehouseSchema, warehouse);

        const data = await this.#Container.WarehouseService.Create({
          data: posted,
        });
        ctx.response.body = stringifyJSON({
          warehouses: data,
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

    this.#warehouses.put("/:id", RoleGuard("ADMIN"), async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        parse(UuidSchema, {
          id: ctx.params.id,
        });

        const body = ctx.request.body();
        let warehouse: Warehouse;
        if (body.type === "json") {
          warehouse = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        warehouse.shop = ctx.state.request_data.publicId;
        warehouse.publicId = ctx.params.id;

        const posted = parse(insertWarehouseSchema, warehouse);

        const data = await Update<Warehouse>(this.#Container, {
          id: `warehouse_${ctx.params.id}`,
          promise: this.#Container.WarehouseService.Update({
            data: posted,
          }),
        });

        ctx.response.body = stringifyJSON({
          warehouses: data,
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

    this.#warehouses.get("/:id", RoleGuard("VIEWER"), async (ctx) => {
      try {
        parse(UuidSchema, {
          id: ctx.params.id,
        });

        const data = await Get<Warehouse>(this.#Container, {
          id: `warehouse_${ctx.params.id}`,
          promise: this.#Container.WarehouseService.Get({
            id: ctx.params.id,
          }),
        });

        ctx.response.body = stringifyJSON({
          warehouses: data,
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

    this.#warehouses.delete("/:id", RoleGuard("ADMIN"), async (ctx) => {
      try {
        parse(UuidSchema, {
          id: ctx.params.id,
        });

        await Delete(this.#Container, {
          id: `warehouse_${ctx.params.id}`,
          promise: this.#Container.WarehouseService.Delete({
            id: ctx.params.id,
          }),
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
    return this.#warehouses.routes();
  }
}
