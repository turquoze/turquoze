import { Router } from "@oakserver/oak";
import RoleGuard from "../../middleware/roleGuard.ts";
import type Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";
import { Shop } from "../../utils/types.ts";

import { Delete, Get, stringifyJSON, Update } from "../../utils/utils.ts";
import { ShopSchema, UuidSchema } from "../../utils/validator.ts";

export default class RegionsRoutes {
  #shops: Router;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#shops = new Router({
      prefix: "/shops",
    });

    this.#shops.use(RoleGuard("SUPERADMIN"));

    this.#shops.post("/", async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const body = ctx.request.body();
        let shop: Shop;
        if (body.type === "json") {
          shop = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        await ShopSchema.validate(shop);
        const posted: Shop = await ShopSchema.cast(shop);

        const data = await this.#Container.ShopService.Create({
          data: posted,
        });

        ctx.response.body = stringifyJSON({
          regions: data,
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

    this.#shops.get("/:id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const data = await Get<Shop>(this.#Container, {
          id: `shop_${ctx.params.id}`,
          promise: this.#Container.ShopService.Get({
            id: ctx.params.id,
          }),
        });

        ctx.response.body = stringifyJSON({
          regions: data,
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

    this.#shops.put("/:id", async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const body = ctx.request.body();
        let shop: Shop;
        if (body.type === "json") {
          shop = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        shop.publicId = ctx.params.id;

        await ShopSchema.validate(shop);
        const posted: Shop = await ShopSchema.cast(shop);

        const data = await Update<Shop>(this.#Container, {
          id: `shop_${ctx.params.id}`,
          promise: this.#Container.ShopService.Update({
            data: posted,
          }),
        });

        ctx.response.body = stringifyJSON({
          regions: data,
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

    this.#shops.delete("/:id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        await Delete(this.#Container, {
          id: `shop_${ctx.params.id}`,
          promise: this.#Container.ShopService.Delete({ id: ctx.params.id }),
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
    return this.#shops.routes();
  }
}
