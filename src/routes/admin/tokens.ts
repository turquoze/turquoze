import { Router } from "../../deps.ts";
import RoleGuard from "../../middleware/roleGuard.ts";
import type Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";
import { Token } from "../../utils/types.ts";

import { Delete, Get, stringifyJSON } from "../../utils/utils.ts";
import { TokenSchema, UuidSchema } from "../../utils/validator.ts";

export default class TokensRoutes {
  #tokens: Router;
  #Container: typeof Container;
  constructor(container: typeof Container) {
    this.#Container = container;
    this.#tokens = new Router({
      prefix: "/tokens",
    });

    this.#tokens.use(RoleGuard("ADMIN"));

    this.#tokens.get("/", async (ctx) => {
      try {
        const data = await this.#Container.TokenService.GetMany({});

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

        token.shop = ctx.state.shop;

        await TokenSchema.validate(token);
        const posted: Token = await TokenSchema.cast(token);

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
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const data = await Get<Token>({
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
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        await Delete({
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
