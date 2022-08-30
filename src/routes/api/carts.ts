import { Router } from "../../deps.ts";
import Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";
import {
  Cart,
  CartItem,
  DiscountCheck,
  TurquozeState,
} from "../../utils/types.ts";
import Dinero from "https://cdn.skypack.dev/dinero.js@1.9.1";

import { Delete, Get, stringifyJSON } from "../../utils/utils.ts";
import {
  CartItemSchema,
  CartSchema,
  DiscountCheckSchema,
  UuidSchema,
} from "../../utils/validator.ts";

export default class CartRoutes {
  #carts: Router<TurquozeState>;
  #Container: typeof Container;
  constructor(container: typeof Container) {
    this.#Container = container;
    this.#carts = new Router<TurquozeState>({
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
        const data = ErrorHandler(error);
        ctx.response.status = data.code;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify({
          message: data.message,
        });
      }
    });

    this.#carts.post("/:id/finalize", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const order = await this.#Container.PaymentService.Create({
          data: {
            cartId: ctx.params.id,
            id: "",
            shop: ctx.state.request_data,
          },
        });

        ctx.response.body = stringifyJSON({
          order: order.id,
          payment: order.payment,
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

        data.price = Dinero({
          amount: (data.price * 100),
          currency: ctx.state.request_data.currency,
        }).getAmount();
        data.totalPrice = Dinero({
          amount: (data.price * 100),
          currency: ctx.state.request_data.currency,
        }).multiply(parseInt(data.quantity.toString())).getAmount();

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

        const data = await this.#Container.CartService.GetAllItems(
          ctx.params.id,
        );

        const response = data.map((item) => {
          item.price = Dinero({
            amount: (item.price * 100),
            currency: ctx.state.request_data.currency,
          }).getAmount();
          item.totalPrice = Dinero({
            amount: (item.price * 100),
            currency: ctx.state.request_data.currency,
          }).multiply(parseInt(item.quantity.toString())).getAmount();

          return item;
        });

        ctx.response.body = stringifyJSON({
          carts: response,
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

        const data = await this.#Container.CartService.GetCartItem(
          ctx.params.id,
          ctx.params.product_id,
        );

        data.price = Dinero({
          amount: (data.price * 100),
          currency: ctx.state.request_data.currency,
        }).getAmount();
        data.totalPrice = Dinero({
          amount: (data.price * 100),
          currency: ctx.state.request_data.currency,
        }).multiply(parseInt(data.quantity.toString())).getAmount();

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

        await this.#Container.CartService.RemoveItem(
          ctx.params.id,
          ctx.params.product_id,
        );

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
