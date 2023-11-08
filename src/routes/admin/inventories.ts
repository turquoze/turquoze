import { Router } from "@oakserver/oak";
import RoleGuard from "../../middleware/roleGuard.ts";
import type Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";

import { Delete, Get, stringifyJSON, Update } from "../../utils/utils.ts";
import { UuidSchema } from "../../utils/validator.ts";
import { parse } from "valibot";
import { insertInventorySchema, Inventory } from "../../utils/schema.ts";

export default class InventoriesRoutes {
  #inventories: Router;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#inventories = new Router({
      prefix: "/inventories",
    });

    this.#inventories.post("/", RoleGuard("ADMIN"), async (ctx) => {
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

        const posted = parse(insertInventorySchema, inventory);

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

    this.#inventories.put("/:id", RoleGuard("ADMIN"), async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        parse(UuidSchema, {
          id: ctx.params.id,
        });

        const body = ctx.request.body();
        let inventory: Inventory;
        if (body.type === "json") {
          inventory = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        inventory.publicId = ctx.params.id;

        const posted = parse(insertInventorySchema, inventory);

        const data = await Update<Inventory>(this.#Container, {
          id: `inventory_${ctx.params.id}`,
          promise: this.#Container.InventoryService.Update({
            data: posted,
          }),
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

    this.#inventories.get("/:id", RoleGuard("VIEWER"), async (ctx) => {
      try {
        parse(UuidSchema, {
          id: ctx.params.id,
        });

        const data = await Get<Inventory>(this.#Container, {
          id: `inventory_${ctx.params.id}`,
          promise: this.#Container.InventoryService.Get({
            id: ctx.params.id,
          }),
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

    this.#inventories.delete("/:id", RoleGuard("ADMIN"), async (ctx) => {
      try {
        parse(UuidSchema, {
          id: ctx.params.id,
        });

        await Delete(this.#Container, {
          id: `inventory_${ctx.params.id}`,
          promise: this.#Container.InventoryService.Delete({
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
    return this.#inventories.routes();
  }
}
