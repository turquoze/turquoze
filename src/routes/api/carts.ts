import { Router } from "../../deps.ts";
import type Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";
import {
  Cart,
  CartItem,
  DiscountItem,
  Shipping,
  TurquozeState,
} from "../../utils/types.ts";
import Dinero from "https://cdn.skypack.dev/dinero.js@1.9.1";

import { stringifyJSON } from "../../utils/utils.ts";
import {
  CartItemSchema,
  CartSchema,
  CommentSchema,
  DiscountItemSchema,
  MetadataSchema,
  ShippingSchema,
  UuidSchema,
} from "../../utils/validator.ts";

export default class CartRoutes {
  #carts: Router<TurquozeState>;
  #Container: Container;
  constructor(container: Container) {
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

    this.#carts.post("/:id/metadata", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const body = ctx.request.body();
        let metadata: Record<string, unknown>;
        if (body.type === "json") {
          metadata = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        await MetadataSchema.validate(metadata);
        const posted: Record<string, unknown> = await MetadataSchema.cast(
          metadata,
        );

        await this.#Container.CartService.AddMetadata({
          id: ctx.params.id,
          metadata: posted,
        });

        ctx.response.body = stringifyJSON({
          metadata: posted,
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

    this.#carts.post("/:id/shipping", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const body = ctx.request.body();
        let shipping: Shipping;
        if (body.type === "json") {
          shipping = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        await ShippingSchema.validate(shipping);
        const posted: Shipping = await ShippingSchema.cast(
          shipping,
        );

        const data = await this.#Container.CartService.AddShipping({
          id: ctx.params.id,
          shipping: posted,
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

    this.#carts.post("/:id/billing", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const body = ctx.request.body();
        let billing: Shipping;
        if (body.type === "json") {
          billing = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        await ShippingSchema.validate(billing);
        const posted: Shipping = await ShippingSchema.cast(
          billing,
        );

        const data = await this.#Container.CartService.AddBilling({
          id: ctx.params.id,
          billing: posted,
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

    this.#carts.post("/:id/comment", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const body = ctx.request.body();
        let comment: { comment: string };
        if (body.type === "json") {
          comment = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        await CommentSchema.validate(comment);
        const posted: { comment: string } = await CommentSchema.cast(
          comment,
        );

        await this.#Container.CartService.UpsertComment({
          id: ctx.params.id,
          comment: posted.comment,
        });

        ctx.response.body = stringifyJSON({
          comment: posted,
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

        const responsePromises = data.map(async (item) => {
          const price = await this.#Container.PriceService.GetByProduct({
            productId: item.item_id,
          });

          item.price = Dinero({
            amount: parseInt(price.amount.toString()),
            currency: ctx.state.request_data.currency,
          }).getAmount();

          item.totalPrice = Dinero({
            amount: parseInt(price.amount.toString()),
            currency: ctx.state.request_data.currency,
          }).multiply(parseInt(item.quantity.toString())).getAmount();

          return item;
        });

        const response = await Promise.all(responsePromises);

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

        const price = await this.#Container.PriceService.GetByProduct({
          productId: ctx.params.product_id,
        });

        data.price = Dinero({
          amount: parseInt(price.amount.toString()),
          currency: ctx.state.request_data.currency,
        }).getAmount();

        data.totalPrice = Dinero({
          amount: parseInt(data.price.toString()),
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

    this.#carts.post("/:id/discounts", async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const body = ctx.request.body();
        let item: DiscountItem;
        if (body.type === "json") {
          item = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        await DiscountItemSchema.validate(item);
        const posted: DiscountItem = await DiscountItemSchema.cast(item);

        const discount = await this.#Container.DiscountService.GetByCode({
          code: posted.code,
        });

        const data = await this.#Container.CartService.ApplyDiscount({
          id: ctx.params.id,
          discount: discount,
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

    this.#carts.delete("/:id/discounts/:discount_id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        await UuidSchema.validate({
          id: ctx.params.discount_id,
        });

        await this.#Container.CartService.RemoveDiscount({
          id: ctx.params.id,
          discountId: ctx.params.discount_id,
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
