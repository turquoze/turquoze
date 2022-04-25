import { Router } from "../../deps.ts";
import Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";
import { Cart, DiscountCheck } from "../../utils/types.ts";

import { stringifyJSON } from "../../utils/utils.ts";
import {
  CartSchema,
  DiscountCheckSchema,
  UuidSchema,
} from "../../utils/validator.ts";

export default class CartRoutes {
  #carts: Router;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#carts = new Router({
      prefix: "/carts",
    });

    this.#carts.post("/", async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const body = ctx.request.body();
        let cart: Cart;
        if (body.type === "json") {
          cart = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        await CartSchema.validate(cart);
        const posted: Cart = await CartSchema.cast(cart);

        const data = await this.#Container.CartService.CreateOrUpdate({
          data: posted,
        });

        ctx.response.body = stringifyJSON({
          carts: data,
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

    this.#carts.post("/:id/discount", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const body = ctx.request.body();
        let discountCheck: DiscountCheck;
        if (body.type === "json") {
          discountCheck = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        await DiscountCheckSchema.validate(discountCheck);
        const posted: DiscountCheck = await DiscountCheckSchema.cast(
          discountCheck,
        );

        const discount = await this.#Container.DiscountService.GetByCode({
          code: posted.code,
        });

        const cart = await this.#Container.CartService.Get({
          id: ctx.params.id,
        });

        if (discount != undefined) {
          if (
            (discount.valid_from ?? 1) <= Date.now() &&
            Date.now() <= (discount.valid_to ?? Number.MAX_SAFE_INTEGER)
          ) {
            const hasDiscount = cart.discounts.cart.find((d) =>
              d.did == discount.id
            );

            if (hasDiscount == undefined) {
              cart.discounts.cart.push({ did: discount.id });
            } else {
              const newDiscountArr = cart.discounts.cart.filter((item) => {
                if (item.did != discount.id) {
                  return item;
                }
              });
              cart.discounts.cart = newDiscountArr;
            }
            await this.#Container.CartService.CreateOrUpdate({
              data: cart,
            });
          }
        }

        ctx.response.body = stringifyJSON({
          carts: cart,
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

    this.#carts.post("/:id/session", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const data = await this.#Container.PaymentService.Create({
          data: {
            cartId: ctx.params.id,
            id: "",
            // @ts-expect-error unknown
            info: {
              data: {
                region: ctx.state.region,
              },
            },
          },
        });
        ctx.response.body = stringifyJSON({
          session: data,
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

    this.#carts.get("/:id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const data = await this.#Container.CartService.Get({
          id: ctx.params.id,
        });
        ctx.response.body = stringifyJSON({
          carts: data,
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

    this.#carts.delete("/:id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        await this.#Container.CartService.Delete({
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
    return this.#carts.routes();
  }
}
