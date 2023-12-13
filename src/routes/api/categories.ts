import { Hono } from "hono";
import type Container from "../../services/mod.ts";
import { ErrorHandler } from "../../utils/errors.ts";
import Dinero from "https://cdn.skypack.dev/dinero.js@1.9.1";

import { Get } from "../../utils/utils.ts";
import { UuidSchema } from "../../utils/validator.ts";
import { parse } from "valibot";
import { Category, Product, Shop } from "../../utils/schema.ts";

export default class CategoriesRoutes {
  #categories: Hono;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#categories = new Hono({ strict: false });

    this.#categories.get("/", async (ctx) => {
      try {
        const offset = parseInt(
          new URL(ctx.req.raw.url).searchParams.get("offset") ?? "",
        );
        const limit = parseInt(
          new URL(ctx.req.raw.url).searchParams.get("limit") ?? "",
        );

        //@ts-expect-error not on type
        const request_data = ctx.get("request_data") as Shop;

        const data = await this.#Container.CategoryService.GetMany({
          shop: request_data.publicId!,
          limit: isNaN(limit) ? undefined : limit,
          offset: isNaN(offset) ? undefined : offset,
        });

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          categories: data,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#categories.get("/byname/:name", async (ctx) => {
      try {
        //@ts-expect-error not on type
        const request_data = ctx.get("request_data") as Shop;

        const data = await Get<Category>(this.#Container, {
          id: `category_name_${request_data.publicId}-${ctx.req.param("name")}`,
          promise: this.#Container.CategoryService.GetByName({
            name: ctx.req.param("name"),
            shop: request_data.publicId!,
          }),
        });

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          categories: data,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#categories.get("/:id/products", async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        //@ts-expect-error not on type
        const request_data = ctx.get("request_data") as Shop;

        const data = await Get<Array<Product>>(this.#Container, {
          id: `products_by_category_${request_data.publicId}-${id}`,
          promise: this.#Container.CategoryLinkService.GetProducts({
            id: id,
          }),
        });

        const productsPromises = data.map(async (product) => {
          const price = await this.#Container.PriceService.GetByProduct({
            productId: product.publicId!,
          });

          product.price = Dinero({
            amount: parseInt((price.amount ?? -1).toString()),
            currency: request_data.currency,
          }).getAmount();

          return product;
        });

        const products = await Promise.all(productsPromises);

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          products,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#categories.get("/:id", async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        const data = await Get<Category>(this.#Container, {
          //@ts-expect-error not on type
          id: `category_${ctx.get("request_data").publicId}-${id}`,
          promise: this.#Container.CategoryService.Get({
            id: id,
          }),
        });

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          categories: data,
        });
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
    return this.#categories;
  }
}
