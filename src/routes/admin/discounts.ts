import RoleGuard from "../../middleware/roleGuard.ts";
import type Container from "../../services/mod.ts";
import { Hono, parse } from "../../deps.ts";

import { Delete, Get, jsonResponse, stringifyJSON } from "../../utils/utils.ts";
import { UuidSchema } from "../../utils/validator.ts";
import { Discount, insertDiscountSchema } from "../../utils/validator.ts";

export default class DiscountsRoutes {
  #discounts: Hono;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#discounts = new Hono({ strict: false });

    this.#discounts.post("/", RoleGuard("ADMIN"), async (ctx) => {
      const discount = await ctx.req.json();
      //@ts-expect-error not on type
      discount.shop = ctx.get("request_data").publicId;

      const posted = parse(insertDiscountSchema, discount);

      const data = await this.#Container.DiscountService.Create({
        data: posted,
      });

      return jsonResponse(
        stringifyJSON({
          discounts: data,
        }),
        200,
      );
    });

    this.#discounts.get("/", RoleGuard("VIEWER"), async (ctx) => {
      const offset = parseInt(
        new URL(ctx.req.raw.url).searchParams.get("offset") ?? "",
      );
      const limit = parseInt(
        new URL(ctx.req.raw.url).searchParams.get("limit") ?? "",
      );

      const data = await this.#Container.DiscountService.GetMany({
        //@ts-expect-error not on type
        shop: ctx.get("request_data").publicId,
        limit: isNaN(limit) ? undefined : limit,
        offset: isNaN(offset) ? undefined : offset,
      });

      return jsonResponse(
        stringifyJSON({
          discounts: data,
        }),
        200,
      );
    });

    this.#discounts.get("/:id", RoleGuard("VIEWER"), async (ctx) => {
      const { id } = parse(UuidSchema, {
        id: ctx.req.param("id"),
      });

      const data = await Get<Discount>(this.#Container, {
        id: `discount_${id}`,
        promise: this.#Container.DiscountService.Get({
          id: id,
        }),
      });

      return jsonResponse(
        stringifyJSON({
          discounts: data,
        }),
        200,
      );
    });

    this.#discounts.delete("/:id", RoleGuard("ADMIN"), async (ctx) => {
      const { id } = parse(UuidSchema, {
        id: ctx.req.param("id"),
      });

      await Delete(this.#Container, {
        id: `discount_${id}`,
        promise: this.#Container.DiscountService.Delete({
          id: id,
        }),
      });

      ctx.res.headers.set("content-type", "application/json");
      return ctx.json({}, 201);
    });
  }

  routes() {
    return this.#discounts;
  }
}
