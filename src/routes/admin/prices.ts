import { Hono } from "hono";
import RoleGuard from "../../middleware/roleGuard.ts";
import type Container from "../../services/mod.ts";
import { ErrorHandler } from "../../utils/errors.ts";

import { Delete, Get, Update } from "../../utils/utils.ts";
import { UuidSchema } from "../../utils/validator.ts";
import { parse } from "valibot";
import { insertPriceSchema, Price } from "../../utils/schema.ts";

export default class PricesRoutes {
  #prices: Hono;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#prices = new Hono({ strict: false });

    this.#prices.get("/", RoleGuard("VIEWER"), async (ctx) => {
      try {
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

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          prices: data,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#prices.post("/", RoleGuard("ADMIN"), async (ctx) => {
      try {
        const price = await ctx.req.json();
        //@ts-expect-error not on type
        price.shop = ctx.get("request_data").publicId;

        const posted = parse(insertPriceSchema, price);

        const data = await this.#Container.PriceService.Create({
          data: posted,
        });

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          prices: data,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#prices.put("/:id", RoleGuard("ADMIN"), async (ctx) => {
      try {
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
          }),
        });

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          prices: data,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#prices.get("/:id", RoleGuard("VIEWER"), async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        const data = await Get<Price>(this.#Container, {
          id: `price_${id}`,
          promise: this.#Container.PriceService.Get({
            id: id,
          }),
        });

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          prices: data,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#prices.delete("/:id", RoleGuard("ADMIN"), async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        await Delete(this.#Container, {
          id: `price_${id}`,
          promise: this.#Container.PriceService.Delete({ id: id }),
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
    return this.#prices;
  }
}
