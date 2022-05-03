import { Router } from "../../deps.ts";
import Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";
import { Warehouse } from "../../utils/types.ts";

import { Delete, Get, stringifyJSON, Update } from "../../utils/utils.ts";
import { UuidSchema, WarehouseSchema } from "../../utils/validator.ts";

export default class WarehousesRoutes {
  #warehouses: Router;
  #Container: typeof Container;
  constructor(container: typeof Container) {
    this.#Container = container;
    this.#warehouses = new Router({
      prefix: "/warehouses",
    });

    this.#warehouses.get("/", async (ctx) => {
      try {
        const data = await Get<Array<Warehouse>>({
          id: `warehousesGetMany-${10}-${undefined}`,
          promise: this.#Container.WarehouseService.GetMany({}),
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

    this.#warehouses.post("/", async (ctx) => {
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

        warehouse.region = ctx.state.region;

        await WarehouseSchema.validate(warehouse);
        const posted: Warehouse = await WarehouseSchema.cast(warehouse);

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

    this.#warehouses.put("/:id", async (ctx) => {
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

        warehouse.region = ctx.state.region;
        warehouse.id = ctx.params.id;

        await WarehouseSchema.validate(warehouse);
        const posted: Warehouse = await WarehouseSchema.cast(warehouse);

        const data = await Update<Warehouse>({
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

    this.#warehouses.get("/:id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const data = await Get<Warehouse>({
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

    this.#warehouses.delete("/:id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        await Delete({
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
