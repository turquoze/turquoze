import { jwt, Router } from "../../deps.ts";
import Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";
import { JWTKEY } from "../../utils/secrets.ts";
import { Cart, CartItem, DiscountCheck } from "../../utils/types.ts";

import { Delete, Get, stringifyJSON } from "../../utils/utils.ts";
import {
  CartItemSchema,
  CartSchema,
  DiscountCheckSchema,
  UuidSchema,
} from "../../utils/validator.ts";

export default class CartRoutes {
  #carts: Router;
  #Container: typeof Container;
  constructor(container: typeof Container) {
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

        const data = await this.#Container.CartService.Create({
          data: posted,
        });

        ctx.response.body = stringifyJSON({
          carts: data,
        });
        ctx.response.headers.set("content-type", "application/json");
      } catch (error) {
        console.log(error);
        const data = ErrorHandler(error);
        ctx.response.status = data.code;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify({
          message: data.message,
        });
      }
    });

    /*
    this.#carts.post("/discount", async (ctx) => {
      try {
        const token = ctx.request.headers.get("x-cart-token");
        if (token == undefined) {
          throw new Error("No token");
        }

        if (!await jwt.default.verify(token, JWTKEY)) {
          throw new Error("No valid token");
        }

        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const { cartId } = jwt.default.decode(token);

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
          id: cartId,
        });

        if (discount != undefined) {
          if (
            (discount.valid_from ?? 1) <= Date.now() &&
            Date.now() <= (discount.valid_to ?? Number.MAX_SAFE_INTEGER)
          ) {
            let hasDiscount = undefined;
            if (cart.discounts != null && cart.discounts != undefined) {
              hasDiscount = cart.discounts?.cart.find((d) =>
                d.did == discount.public_id
              );
            }

            if (hasDiscount == undefined) {
              cart.discounts = { cart: [{ did: discount.public_id }] };
            } else {
              const newDiscountArr = cart.discounts.cart.filter((item) => {
                if (item.did != discount.public_id) {
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
    */

    this.#carts.post("/:id/init", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        /*const cart = await Get<Cart>({
          id: `cart_${ctx.params.id}`,
          promise: this.#Container.CartService.Get({
            id: ctx.params.id,
          }),
        });*/

        const cart = await this.#Container.CartService.Get({
          id: ctx.params.id,
        });

        const token = await jwt.default.sign({
          cartId: cart.public_id,
          nbf: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (1 * (60 * 60)),
        }, JWTKEY);

        ctx.response.body = stringifyJSON({
          token: token,
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

    this.#carts.post("/:id/items", async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const body = ctx.request.body();
        let item: CartItem;
        if (body.type === "json") {
          item = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        await CartItemSchema.validate(item);
        const posted: CartItem = await CartItemSchema.cast(item);

        const data = await this.#Container.CartService.AddItem({
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

    this.#carts.get("/:id/items", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const data = await Get<Array<CartItem>>({
          id: `cart_items_${ctx.params.id}`,
          promise: this.#Container.CartService.GetAllItems(ctx.params.id),
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

    this.#carts.get("/:id/items/:product_id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        await UuidSchema.validate({
          id: ctx.params.product_id,
        });

        const data = await Get<CartItem>({
          id: `cart_items_${ctx.params.id}_${ctx.params.product_id}`,
          promise: this.#Container.CartService.GetCartItem(
            ctx.params.id,
            ctx.params.product_id,
          ),
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

    this.#carts.delete("/:id/items/:product_id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        await UuidSchema.validate({
          id: ctx.params.product_id,
        });

        await Delete({
          id: `cart_${ctx.params.id}`,
          promise: this.#Container.CartService.RemoveItem(
            ctx.params.id,
            ctx.params.product_id,
          ),
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

    this.#carts.get("/:id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const data = await Get<Cart>({
          id: `cart_${ctx.params.id}`,
          promise: this.#Container.CartService.Get({ id: ctx.params.id }),
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

        await Delete({
          id: `cart_${ctx.params.id}`,
          promise: this.#Container.CartService.Delete({
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
    return this.#carts.routes();
  }
}
