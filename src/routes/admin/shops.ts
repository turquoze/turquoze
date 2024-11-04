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
import { insertShopSchema } from "../../utils/validator.ts";

export default class RegionsRoutes {
  #shops: Hono;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#shops = new Hono({ strict: false });

    this.#shops.use(RoleGuard("SUPERADMIN"));

    this.#shops.post("/", async (ctx) => {
      const shop = await ctx.req.json();

      const posted = parse(insertShopSchema, shop);

      const data = await this.#Container.ShopService.Create({
        data: posted,
      });

      return jsonResponse(
        stringifyJSON({
          regions: data,
        }),
        200,
      );
    });

    this.#shops.get("/:id", async (ctx) => {
      const { id } = parse(UuidSchema, {
        id: ctx.req.param("id"),
      });

      const data = await Get(this.#Container, {
        id: `shop_${id}`,
        promise: this.#Container.ShopService.Get({
          id: id,
        }),
      });

      return jsonResponse(
        stringifyJSON({
          regions: data,
        }),
        200,
      );
    });

    this.#shops.put("/:id", async (ctx) => {
      const { id } = parse(UuidSchema, {
        id: ctx.req.param("id"),
      });

      const shop = await ctx.req.json();
      shop.publicId = id;

      const posted = parse(insertShopSchema, shop);

      const data = await Update(this.#Container, {
        id: `shop_${id}`,
        promise: this.#Container.ShopService.Update({
          data: posted,
        }),
      });

      return jsonResponse(
        stringifyJSON({
          regions: data,
        }),
        200,
      );
    });

    this.#shops.delete("/:id", async (ctx) => {
      const { id } = parse(UuidSchema, {
        id: ctx.req.param("id"),
      });

      await Delete(this.#Container, {
        id: `shop_${id}`,
        promise: this.#Container.ShopService.Delete({ id: id }),
      });

      ctx.res.headers.set("content-type", "application/json");
      return ctx.json({}, 201);
    });
  }

  routes() {
    return this.#shops;
  }
}
