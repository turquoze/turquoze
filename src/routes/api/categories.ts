import { parse } from "@valibot/valibot";
import type Container from "../../services/mod.ts";
import { ErrorHandler } from "../../utils/errors.ts";
import Dinero from "dinero.js";
import { Hono } from "@hono/hono";
import { Get, jsonResponse, stringifyJSON } from "../../utils/utils.ts";
import { UuidSchema } from "../../utils/validator.ts";
import { Category, Product, Shop } from "../../utils/validator.ts";

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

        return jsonResponse(
          stringifyJSON({
            categories: data,
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

        return jsonResponse(
          stringifyJSON({
            categories: data,
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

          if (price != null || price != undefined) {
            product.price = Dinero({
              amount: parseInt((price.amount ?? -1).toString()),
              currency: request_data.currency,
            }).getAmount();
          }

          return product;
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

        return jsonResponse(
          stringifyJSON({
            categories: data,
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
  }

  routes() {
    return this.#categories;
  }
}
