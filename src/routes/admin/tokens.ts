import RoleGuard from "../../middleware/roleGuard.ts";
import type Container from "../../services/mod.ts";
import { ErrorHandler } from "../../utils/errors.ts";
import { parse } from "@valibot/valibot";
import { Hono } from "@hono/hono";

import { Delete, Get, jsonResponse, stringifyJSON } from "../../utils/utils.ts";
import { UuidSchema } from "../../utils/validator.ts";
import { insertTokenSchema, Token } from "../../utils/validator.ts";

export default class TokensRoutes {
  #tokens: Hono;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#tokens = new Hono({ strict: false });

    this.#tokens.use(RoleGuard("ADMIN"));

    this.#tokens.get("/", async (ctx) => {
      try {
        const offset = parseInt(
          new URL(ctx.req.raw.url).searchParams.get("offset") ?? "",
        );
        const limit = parseInt(
          new URL(ctx.req.raw.url).searchParams.get("limit") ?? "",
        );

        const data = await this.#Container.TokenService.GetMany({
          //@ts-expect-error not on type
          shop: ctx.get("request_data").publicId,
          limit: isNaN(limit) ? undefined : limit,
          offset: isNaN(offset) ? undefined : offset,
        });

        return jsonResponse(
          stringifyJSON({
            tokens: data,
          }),
          200,
        );
      } catch (error) {
        const data = ErrorHandler(error as Error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#tokens.post("/", async (ctx) => {
      try {
        const token = await ctx.req.json();
        //@ts-expect-error not on type
        token.shop = ctx.get("request_data").publicId;

        const posted = parse(insertTokenSchema, token);

        const data = await this.#Container.TokenService.Create({
          data: posted,
        });

        return jsonResponse(
          stringifyJSON({
            tokens: data,
          }),
          200,
        );
      } catch (error) {
        const data = ErrorHandler(error as Error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#tokens.get("/:id", async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        const data = await Get<Token>(this.#Container, {
          id: `shop_${id}`,
          promise: this.#Container.TokenService.Get({
            tokenId: id,
          }),
        });

        return jsonResponse(
          stringifyJSON({
            tokens: data,
          }),
          200,
        );
      } catch (error) {
        const data = ErrorHandler(error as Error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#tokens.delete("/:id", async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        await Delete(this.#Container, {
          id: `shop_${id}`,
          promise: this.#Container.TokenService.Delete({
            tokenId: id,
          }),
        });

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({}, 201);
      } catch (error) {
        const data = ErrorHandler(error as Error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });
  }

  routes() {
    return this.#tokens;
  }
}
