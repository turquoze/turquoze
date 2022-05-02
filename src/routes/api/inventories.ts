import { Delete, Get, Update } from "../../dataAccessLayer/cacheOrDb.ts";
import { Router } from "../../deps.ts";
import Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";
import { Inventory } from "../../utils/types.ts";

import { stringifyJSON } from "../../utils/utils.ts";
import { InventorySchema, UuidSchema } from "../../utils/validator.ts";

export default class InventoriesRoutes {
  #inventories: Router;
  #Container: typeof Container;
  constructor(container: typeof Container) {
    this.#Container = container;
    this.#inventories = new Router({
      prefix: "/inventories",
    });

    this.#inventories.post("/", async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const body = ctx.request.body();
        let inventory: Inventory;
        if (body.type === "json") {
          inventory = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        await InventorySchema.validate(inventory);
        const posted: Inventory = await InventorySchema.cast(inventory);

        const data = await this.#Container.InventoryService.Create({
          data: posted,
        });
        ctx.response.body = stringifyJSON({
          inventories: data,
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

    this.#inventories.put("/:id", async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const body = ctx.request.body();
        let inventory: Inventory;
        if (body.type === "json") {
          inventory = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        inventory.id = ctx.params.id;

        await InventorySchema.validate(inventory);
        const posted: Inventory = await InventorySchema.cast(inventory);

        const data = await Update<Inventory>({
          id: `inventory_${ctx.params.id}`,
          promise: this.#Container.InventoryService.Update({
            data: posted,
          }),
        });

        /*const data = await this.#Container.InventoryService.Update({
          data: posted,
        });*/
        ctx.response.body = stringifyJSON({
          inventories: data,
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

    this.#inventories.get("/:id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const data = await Get<Inventory>({
          id: `inventory_${ctx.params.id}`,
          promise: this.#Container.InventoryService.Get({
            id: ctx.params.id,
          }),
        });

        /*const data = await this.#Container.InventoryService.Get({
          id: ctx.params.id,
        });*/
        ctx.response.body = stringifyJSON({
          inventories: data,
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

    this.#inventories.delete("/:id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        await Delete({
          id: `inventory_${ctx.params.id}`,
          promise: this.#Container.InventoryService.Delete({
            id: ctx.params.id,
          }),
        });

        //await this.#Container.InventoryService.Delete({ id: ctx.params.id });
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
    return this.#inventories.routes();
  }
}
