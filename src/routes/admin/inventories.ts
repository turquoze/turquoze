import RoleGuard from "../../middleware/roleGuard.ts";
import type Container from "../../services/mod.ts";
import { ErrorHandler } from "../../utils/errors.ts";
import { parse } from "@valibot/valibot";
import { Hono } from "@hono/hono";

import {
  Delete,
  Get,
  jsonResponse,
  stringifyJSON,
  Update,
} from "../../utils/utils.ts";
import { UuidSchema } from "../../utils/validator.ts";
import { insertInventorySchema, Inventory } from "../../utils/validator.ts";

export default class InventoriesRoutes {
  #inventories: Hono;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#inventories = new Hono({ strict: false });

    this.#inventories.post("/", RoleGuard("ADMIN"), async (ctx) => {
      try {
        const inventory = await ctx.req.json();
        const posted = parse(insertInventorySchema, inventory);

        const data = await this.#Container.InventoryService.Create({
          data: posted,
        });
        return jsonResponse(
          stringifyJSON({
            inventories: data,
          }),
          200,
        );
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#inventories.put("/:id", RoleGuard("ADMIN"), async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        const inventory = await ctx.req.json();
        inventory.publicId = id;

        const posted = parse(insertInventorySchema, inventory);

        const data = await Update<Inventory>(this.#Container, {
          id: `inventory_${id}`,
          promise: this.#Container.InventoryService.Update({
            data: posted,
          }),
        });

        return jsonResponse(
          stringifyJSON({
            inventories: data,
          }),
          200,
        );
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#inventories.get("/:id", RoleGuard("VIEWER"), async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        const data = await Get<Inventory>(this.#Container, {
          id: `inventory_${id}`,
          promise: this.#Container.InventoryService.Get({
            id: id,
          }),
        });

        return jsonResponse(
          stringifyJSON({
            inventories: data,
          }),
          200,
        );
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#inventories.delete("/:id", RoleGuard("ADMIN"), async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        await Delete(this.#Container, {
          id: `inventory_${id}`,
          promise: this.#Container.InventoryService.Delete({
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
    return this.#inventories;
  }
}
