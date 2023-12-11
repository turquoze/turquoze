import { Hono } from "hono";
import type Container from "../../services/mod.ts";
import { ErrorHandler } from "../../utils/errors.ts";
import Dinero from "https://cdn.skypack.dev/dinero.js@1.9.1";

import {
  CommentSchema,
  DiscountItemSchema,
  MetadataSchema,
  ShippingSchema,
  UuidSchema,
} from "../../utils/validator.ts";
import { parse } from "valibot";
import {
  CartItem,
  insertCartItemSchema,
  insertCartSchema,
  Shop,
} from "../../utils/schema.ts";

export default class CartRoutes {
  #carts: Hono;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#carts = new Hono();

    this.#carts.post("/", async (ctx) => {
      try {
        const cart = await ctx.req.json();
        const posted = parse(insertCartSchema, cart);

        const data = await this.#Container.CartService.Create({
          data: posted,
        });

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          carts: data,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#carts.post("/:id/finalize", async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        const order = await this.#Container.PaymentService.Create({
          data: {
            cartId: id,
            id: "",
            //@ts-expect-error not on type
            shop: ctx.get("request_data"),
          },
        });

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          order: order.id,
          payment: order.payment,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#carts.post("/:id/metadata", async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        const metadata = await ctx.req.json();

        const posted = parse(MetadataSchema, metadata);

        await this.#Container.CartService.AddMetadata({
          id: id,
          metadata: posted,
        });

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          metadata: posted,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#carts.post("/:id/shipping", async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        const shipping = await ctx.req.json();

        const posted = parse(ShippingSchema, shipping);

        const data = await this.#Container.CartService.AddShipping({
          id: id,
          shipping: posted,
        });

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          carts: data,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#carts.post("/:id/billing", async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        const billing = ctx.req.json();

        const posted = parse(ShippingSchema, billing);

        const data = await this.#Container.CartService.AddBilling({
          id: id,
          billing: posted,
        });

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          carts: data,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#carts.post("/:id/items", async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        const item = await ctx.req.json();
        item.cartId = id;
        const posted = parse(insertCartItemSchema, item);

        const data = await this.#Container.CartService.AddItem({
          data: posted,
        });

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          carts: data,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#carts.post("/:id/comment", async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        const comment = ctx.req.json();

        const posted = parse(CommentSchema, comment);

        await this.#Container.CartService.UpsertComment({
          id: id,
          comment: posted.comment,
        });

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          comment: posted,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#carts.get("/:id/items", async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        const data = await this.#Container.CartService.GetAllItems(
          id,
        ) as Array<CartItem>;

        //@ts-expect-error not on type
        const request_data = ctx.get("request_data") as Shop;

        const responsePromises = data.map(async (item) => {
          const price = await this.#Container.PriceService.GetByProduct({
            productId: item.itemId!,
          });

          item.price = Dinero({
            amount: parseInt((price.amount ?? -1).toString()),
            currency: request_data.currency,
          }).getAmount();

          item.totalPrice = Dinero({
            amount: parseInt((price.amount ?? -1).toString()),
            currency: request_data.currency,
          }).multiply(parseInt((item.quantity ?? 0).toString())).getAmount();

          return item;
        });

        const response = await Promise.all(responsePromises);

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          carts: response,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#carts.get("/:id/items/:product_id", async (ctx) => {
      try {
        const id = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        const productId = parse(UuidSchema, {
          id: ctx.req.param("product_id"),
        });

        const data = await this.#Container.CartService.GetCartItem(
          id.id,
          productId.id,
        ) as CartItem;

        const price = await this.#Container.PriceService.GetByProduct({
          productId: productId.id,
        });

        //@ts-expect-error not on type
        const request_data = ctx.get("request_data") as Shop;

        data.price = Dinero({
          amount: parseInt((price.amount ?? -1).toString()),
          currency: request_data.currency,
        }).getAmount();

        data.totalPrice = Dinero({
          amount: parseInt(data.price.toString()),
          currency: request_data.currency,
        }).multiply(parseInt((data.quantity ?? 0).toString())).getAmount();

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          carts: data,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#carts.delete("/:id/items/:product_id", async (ctx) => {
      try {
        const id = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        const productId = parse(UuidSchema, {
          id: ctx.req.param("product_id"),
        });

        await this.#Container.CartService.RemoveItem(
          id.id,
          productId.id,
        );

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({}, 201);
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#carts.get("/:id", async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        const data = await this.#Container.CartService.Get({
          id: id,
        });

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          carts: data,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#carts.delete("/:id", async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        await this.#Container.CartService.Delete({
          id: id,
        });

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({}, 201);
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#carts.post("/:id/discounts", async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        const item = await ctx.req.json();
        const posted = parse(DiscountItemSchema, item);

        const discount = await this.#Container.DiscountService.GetByCode({
          code: posted.code,
        });

        const data = await this.#Container.CartService.ApplyDiscount({
          id: id,
          discount: discount,
        });

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          carts: data,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#carts.delete("/:id/discounts/:discount_id", async (ctx) => {
      try {
        const id = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        const discount = parse(UuidSchema, {
          id: ctx.req.param("discount_id"),
        });

        await this.#Container.CartService.RemoveDiscount({
          id: id.id,
          discountId: discount.id,
        });

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({}, 201);
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });
  }

  routes() {
    return this.#carts;
  }
}
