import { Router } from "../../deps.ts";
import RoleGuard from "../../middleware/roleGuard.ts";
import type Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";
import { Price, TurquozeState } from "../../utils/types.ts";

import { Delete, Get, stringifyJSON, Update } from "../../utils/utils.ts";
import { PriceSchema, UuidSchema } from "../../utils/validator.ts";

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
        const data = await this.#Container.PriceService.GetMany({
          shop: ctx.state.request_data.public_id,
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

        price.shop = ctx.state.shop;

        await PriceSchema.validate(price);
        const posted: Price = await PriceSchema.cast(price);

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

        const body = ctx.request.body();
        let price: Price;
        if (body.type === "json") {
          price = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        price.public_id = ctx.params.id;
        price.shop = ctx.state.shop;

        await PriceSchema.validate(price);
        const posted: Price = await PriceSchema.cast(price);

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
        await UuidSchema.validate({
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
        await UuidSchema.validate({
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
