import { Router } from "@oakserver/oak";
import RoleGuard from "../../middleware/roleGuard.ts";
import type Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";
import { TurquozeState } from "../../utils/types.ts";

import { Delete, Get, stringifyJSON, Update } from "../../utils/utils.ts";
import { UuidSchema } from "../../utils/validator.ts";
import { parse } from "valibot";
import { insertPriceSchema, Price } from "../../utils/schema.ts";

export default class PricesRoutes {
  #prices: Router<TurquozeState>;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#prices = new Router<TurquozeState>({
      prefix: "/prices",
    });

    this.#prices.get("/", RoleGuard("VIEWER"), async (ctx) => {
      try {
        const offset = parseInt(
          ctx.request.url.searchParams.get("offset") ?? "",
        );
        const limit = parseInt(ctx.request.url.searchParams.get("limit") ?? "");

        const data = await this.#Container.PriceService.GetMany({
          shop: ctx.state.request_data.publicId,
          limit: isNaN(limit) ? undefined : limit,
          offset: isNaN(offset) ? undefined : offset,
        });

        ctx.response.body = stringifyJSON({
          prices: data,
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

    this.#prices.post("/", RoleGuard("ADMIN"), async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const body = ctx.request.body();
        let price: Price;
        if (body.type === "json") {
          price = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        price.shop = ctx.state.request_data.publicId;

        const posted = parse(insertPriceSchema, price);

        const data = await this.#Container.PriceService.Create({
          data: posted,
        });
        ctx.response.body = stringifyJSON({
          prices: data,
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

    this.#prices.put("/:id", RoleGuard("ADMIN"), async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        parse(UuidSchema, {
          id: ctx.params.id,
        });

        const body = ctx.request.body();
        let price: Price;
        if (body.type === "json") {
          price = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        price.publicId = ctx.params.id;
        price.shop = ctx.state.request_data.publicId;

        const posted = parse(insertPriceSchema, price);

        const data = await Update(this.#Container, {
          id: `price_${posted.id}`,
          promise: this.#Container.PriceService.Update({
            data: posted,
          }),
        });

        ctx.response.body = stringifyJSON({
          prices: data,
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

    this.#prices.get("/:id", RoleGuard("VIEWER"), async (ctx) => {
      try {
        parse(UuidSchema, {
          id: ctx.params.id,
        });

        const data = await Get<Price>(this.#Container, {
          id: `price_${ctx.params.id}`,
          promise: this.#Container.PriceService.Get({
            id: ctx.params.id,
          }),
        });

        ctx.response.body = stringifyJSON({
          prices: data,
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

    this.#prices.delete("/:id", RoleGuard("ADMIN"), async (ctx) => {
      try {
        parse(UuidSchema, {
          id: ctx.params.id,
        });

        await Delete(this.#Container, {
          id: `price_${ctx.params.id}`,
          promise: this.#Container.PriceService.Delete({ id: ctx.params.id }),
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
    return this.#prices.routes();
  }
}
