import { parse } from "@valibot/valibot";
import RoleGuard from "../../middleware/roleGuard.ts";
import type Container from "../../services/mod.ts";
import { ErrorHandler } from "../../utils/errors.ts";
import Dinero from "https://cdn.skypack.dev/dinero.js@1.9.1";
import { Hono } from "@hono/hono";
import {
  Delete,
  Get,
  jsonResponse,
  stringifyJSON,
  Update,
} from "../../utils/utils.ts";
import { UuidSchema } from "../../utils/validator.ts";
import { insertProductSchema, Product, Shop } from "../../utils/validator.ts";

export default class ProductsRoutes {
  #products: Hono;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#products = new Hono({ strict: false });

    this.#products.get("/", RoleGuard("VIEWER"), async (ctx) => {
      try {
        const offset = parseInt(
          new URL(ctx.req.raw.url).searchParams.get("offset") ?? "",
        );
        const limit = parseInt(
          new URL(ctx.req.raw.url).searchParams.get("limit") ?? "",
        );

        //@ts-expect-error not on type
        const request_data = ctx.get("request_data") as Shop;

        const data = await this.#Container.ProductService.GetMany({
          shop: request_data.publicId!,
          limit: isNaN(limit) ? undefined : limit,
          offset: isNaN(offset) ? undefined : offset,
        });

        const productsPromises = data.map(async (product) => {
          const localProduct: Product = {
            ...product,
            price: 0,
          };
          const price = await this.#Container.PriceService.GetByProduct({
            productId: product.publicId!,
          });

          if (price != null || price != undefined) {
            localProduct.price = Dinero({
              amount: parseInt((price.amount ?? -1).toString()),
              currency: request_data.currency,
            }).getAmount();
          }

          return localProduct;
        });

        const products = await Promise.all(productsPromises);

        return jsonResponse(
          stringifyJSON({
            products,
          }),
          200,
        );
      } catch (error) {
        const data = ErrorHandler(error as Error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#products.post("/", RoleGuard("ADMIN"), async (ctx) => {
      try {
        const product = await ctx.req.json();
        //@ts-expect-error not on type
        const request_data = ctx.get("request_data") as Shop;

        product.shop = request_data.publicId!;

        const posted = parse(insertProductSchema, product);

        const data = await this.#Container.ProductService.Create({
          data: posted,
        });

        return jsonResponse(
          stringifyJSON({
            products: data,
          }),
          200,
        );
      } catch (error) {
        const data = ErrorHandler(error as Error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#products.get("/:id", RoleGuard("VIEWER"), async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        //@ts-expect-error not on type
        const request_data = ctx.get("request_data") as Shop;

        const data = await Get<Product>(this.#Container, {
          id: `product_${request_data.publicId}-${id}`,
          //@ts-ignore not on type
          promise: this.#Container.ProductService.Get({
            id: id,
          }),
        });

        const price = await this.#Container.PriceService.GetByProduct({
          productId: id,
        });

        if (price != null || price != undefined) {
          data.price = Dinero({
            amount: parseInt((price.amount ?? -1).toString()),
            currency: request_data.currency,
          }).getAmount();
        }

        return jsonResponse(
          stringifyJSON({
            products: data,
          }),
          200,
        );
      } catch (error) {
        const data = ErrorHandler(error as Error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#products.put("/:id", RoleGuard("ADMIN"), async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        const product = await ctx.req.json();
        //@ts-expect-error not on type
        const request_data = ctx.get("request_data") as Shop;

        product.publicId = id;
        product.shop = request_data.publicId!;

        const posted = parse(insertProductSchema, product);

        const data = await Update<Product>(this.#Container, {
          id: `product_${request_data.publicId}-${product.id}`,
          //@ts-ignore not on type
          promise: this.#Container.ProductService.Update({
            data: posted,
          }),
        });

        return jsonResponse(
          stringifyJSON({
            products: data,
          }),
          200,
        );
      } catch (error) {
        const data = ErrorHandler(error as Error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#products.delete("/:id", RoleGuard("ADMIN"), async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        await Delete(this.#Container, {
          //@ts-expect-error not on type
          id: `product_${ctx.get("request_data").publicId}-${id}`,
          promise: this.#Container.ProductService.Delete({ id: id }),
        });

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({}, 201);
      } catch (error) {
        const data = ErrorHandler(error as Error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });
  }

  routes() {
    return this.#products;
  }
}
