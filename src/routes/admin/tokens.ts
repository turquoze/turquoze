import { Router } from "@oakserver/oak";
import RoleGuard from "../../middleware/roleGuard.ts";
import type Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";

import { Delete, Get, stringifyJSON } from "../../utils/utils.ts";
import { UuidSchema } from "../../utils/validator.ts";
import { parse } from "valibot";
import { insertTokenSchema, Token } from "../../utils/schema.ts";

export default class TokensRoutes {
  #tokens: Router;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#tokens = new Router({
      prefix: "/tokens",
    });

    this.#tokens.use(RoleGuard("ADMIN"));

    this.#tokens.get("/", async (ctx) => {
      try {
        const offset = parseInt(
          ctx.request.url.searchParams.get("offset") ?? "",
        );
        const limit = parseInt(ctx.request.url.searchParams.get("limit") ?? "");

        const data = await this.#Container.TokenService.GetMany({
          shop: ctx.state.request_data.publicId,
          limit: isNaN(limit) ? undefined : limit,
          offset: isNaN(offset) ? undefined : offset,
        });

        ctx.response.body = stringifyJSON({
          tokens: data,
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

    this.#tokens.post("/", async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const body = ctx.request.body();
        let token: Token;
        if (body.type === "json") {
          token = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        token.shop = ctx.state.request_data.publicId;

        const posted = parse(insertTokenSchema, token);

        const data = await this.#Container.TokenService.Create({
          data: posted,
        });

        ctx.response.body = stringifyJSON({
          tokens: data,
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

    this.#tokens.get("/:id", async (ctx) => {
      try {
        parse(UuidSchema, {
          id: ctx.params.id,
        });

        const data = await Get<Token>(this.#Container, {
          id: `shop_${ctx.params.id}`,
          promise: this.#Container.TokenService.Get({
            tokenId: ctx.params.id,
          }),
        });

        ctx.response.body = stringifyJSON({
          tokens: data,
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

    this.#tokens.delete("/:id", async (ctx) => {
      try {
        parse(UuidSchema, {
          id: ctx.params.id,
        });

        await Delete(this.#Container, {
          id: `shop_${ctx.params.id}`,
          promise: this.#Container.TokenService.Delete({
            tokenId: ctx.params.id,
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
    return this.#tokens.routes();
  }
}
