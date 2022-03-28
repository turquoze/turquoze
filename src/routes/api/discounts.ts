import { Router } from "../../deps.ts";
import Container from "../../services/mod.ts";
import { ErrorHandler } from "../../utils/errors.ts";

import { stringifyJSON } from "../../utils/utils.ts";
import { UuidSchema } from "../../utils/validator.ts";

export default class DiscountsRoutes {
  #discounts: Router;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#discounts = new Router({
      prefix: "/discounts",
    });

    this.#discounts.post("/", async (ctx) => {
      try {
        const data = await this.#Container.DiscountService.Create({
          data: {
            id: "",
            type: "FIXED",
            valid_from: null,
            valid_to: null,
            value: 20,
            region: ctx.state.region,
          },
        });
        ctx.response.body = stringifyJSON({
          discounts: data,
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

    this.#discounts.get("/", async (ctx) => {
      try {
        const data = await this.#Container.DiscountService.GetMany({});
        ctx.response.body = stringifyJSON({
          discounts: data,
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

    this.#discounts.get("/:id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const data = await this.#Container.DiscountService.Get({
          id: ctx.params.id,
        });
        ctx.response.body = stringifyJSON({
          discounts: data,
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

    this.#discounts.delete("/:id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        await this.#Container.DiscountService.Delete({
          id: ctx.params.id,
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
    return this.#discounts.routes();
  }
}
