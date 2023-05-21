import { Router } from "../../deps.ts";
import RoleGuard from "../../middleware/roleGuard.ts";
import type Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";
import { Discount } from "../../utils/types.ts";

import { Delete, Get, stringifyJSON } from "../../utils/utils.ts";
import { DiscountSchema, UuidSchema } from "../../utils/validator.ts";

export default class DiscountsRoutes {
  #discounts: Router;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#discounts = new Router({
      prefix: "/discounts",
    });

    this.#discounts.post("/", RoleGuard("ADMIN"), async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const body = ctx.request.body();
        let discount: Discount;
        if (body.type === "json") {
          discount = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        discount.shop = ctx.state.shop;

        await DiscountSchema.validate(discount);
        const posted: Discount = await DiscountSchema.cast(discount);

        const data = await this.#Container.DiscountService.Create({
          data: posted,
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

    this.#discounts.get("/", RoleGuard("VIEWER"), async (ctx) => {
      try {
        const data = await Get<Array<Discount>>(this.#Container, {
          id: `discountsGetMany-${10}-${undefined}`,
          promise: this.#Container.DiscountService.GetMany({
            shop: ctx.state.request_data.public_id,
          }),
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

    this.#discounts.get("/:id", RoleGuard("VIEWER"), async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const data = await Get<Discount>(this.#Container, {
          id: `discount_${ctx.params.id}`,
          promise: this.#Container.DiscountService.Get({
            id: ctx.params.id,
          }),
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

    this.#discounts.delete("/:id", RoleGuard("ADMIN"), async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        await Delete(this.#Container, {
          id: `discount_${ctx.params.id}`,
          promise: this.#Container.DiscountService.Delete({
            id: ctx.params.id,
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
    return this.#discounts.routes();
  }
}
