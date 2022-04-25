import { Router } from "../../deps.ts";
import Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";
import { Price } from "../../utils/types.ts";

import { stringifyJSON } from "../../utils/utils.ts";
import { PriceSchema, UuidSchema } from "../../utils/validator.ts";

export default class PricesRoutes {
  #prices: Router;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#prices = new Router({
      prefix: "/prices",
    });

    this.#prices.get("/", async (ctx) => {
      try {
        const data = await this.#Container.PriceService.GetMany({});
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

    this.#prices.post("/", async (ctx) => {
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

        price.region = ctx.state.region;

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

    this.#prices.put("/:id", async (ctx) => {
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

        price.id = ctx.params.id;
        price.region = ctx.state.region;

        await PriceSchema.validate(price);
        const posted: Price = await PriceSchema.cast(price);

        const data = await this.#Container.PriceService.Update({
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

    this.#prices.get("/:id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const data = await this.#Container.PriceService.Get({
          id: ctx.params.id,
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

    this.#prices.delete("/:id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        await this.#Container.PriceService.Delete({ id: ctx.params.id });
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