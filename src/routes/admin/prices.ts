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
import { insertPriceSchema, Price } from "../../utils/validator.ts";

export default class PricesRoutes {
  #prices: Hono;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#prices = new Hono({ strict: false });

    this.#prices.get("/", RoleGuard("VIEWER"), async (ctx) => {
      const offset = parseInt(
        new URL(ctx.req.raw.url).searchParams.get("offset") ?? "",
      );
      const limit = parseInt(
        new URL(ctx.req.raw.url).searchParams.get("limit") ?? "",
      );

      const data = await this.#Container.PriceService.GetMany({
        //@ts-expect-error not on type
        shop: ctx.get("request_data").publicId,
        limit: isNaN(limit) ? undefined : limit,
        offset: isNaN(offset) ? undefined : offset,
      });

      return jsonResponse(
        stringifyJSON({
          prices: data,
        }),
        200,
      );
    });

    this.#prices.post("/", RoleGuard("ADMIN"), async (ctx) => {
      const price = await ctx.req.json();
      //@ts-expect-error not on type
      price.shop = ctx.get("request_data").publicId;

      const posted = parse(insertPriceSchema, price);

      const data = await this.#Container.PriceService.Create({
        data: posted,
      });

      return jsonResponse(
        stringifyJSON({
          prices: data,
        }),
        200,
      );
    });

    this.#prices.put("/:id", RoleGuard("ADMIN"), async (ctx) => {
      const { id } = parse(UuidSchema, {
        id: ctx.req.param("id"),
      });

      const price = await ctx.req.json();

      price.publicId = id;
      //@ts-expect-error not on type
      price.shop = ctx.get("request_data").publicId;

      const posted = parse(insertPriceSchema, price);

      const data = await Update(this.#Container, {
        id: `price_${posted.id}`,
        promise: this.#Container.PriceService.Update({
          data: posted,
          id: id,
        }),
      });

      return jsonResponse(
        stringifyJSON({
          prices: data,
        }),
        200,
      );
    });

    this.#prices.get("/:id", RoleGuard("VIEWER"), async (ctx) => {
      const { id } = parse(UuidSchema, {
        id: ctx.req.param("id"),
      });

      const data = await Get<Price>(this.#Container, {
        id: `price_${id}`,
        promise: this.#Container.PriceService.Get({
          id: id,
        }),
      });

      return jsonResponse(
        stringifyJSON({
          prices: data,
        }),
        200,
      );
    });

    this.#prices.delete("/:id", RoleGuard("ADMIN"), async (ctx) => {
      const { id } = parse(UuidSchema, {
        id: ctx.req.param("id"),
      });

      await Delete(this.#Container, {
        id: `price_${id}`,
        promise: this.#Container.PriceService.Delete({ id: id }),
      });

      ctx.res.headers.set("content-type", "application/json");
      return ctx.json({}, 201);
    });
  }

  routes() {
    return this.#prices;
  }
}
