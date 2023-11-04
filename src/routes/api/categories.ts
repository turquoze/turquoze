import { Router } from "../../deps.ts";
import type Container from "../../services/mod.ts";
import { ErrorHandler } from "../../utils/errors.ts";
import { Category, Product, TurquozeState } from "../../utils/types.ts";
import Dinero from "https://cdn.skypack.dev/dinero.js@1.9.1";

import { Get, stringifyJSON } from "../../utils/utils.ts";
import { UuidSchema } from "../../utils/validator.ts";

export default class CategoriesRoutes {
  #categories: Router<TurquozeState>;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#categories = new Router<TurquozeState>({
      prefix: "/categories",
    });

    this.#categories.get("/", async (ctx) => {
      try {
        const data = await this.#Container.CategoryService.GetMany({
          shop: ctx.state.request_data.publicId,
        });

        ctx.response.body = stringifyJSON({
          categories: data,
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

    this.#categories.get("/byname/:name", async (ctx) => {
      try {
        const data = await Get<Category>(this.#Container, {
          id:
            `category_name_${ctx.state.request_data.publicId}-${ctx.params.name}`,
          promise: this.#Container.CategoryService.GetByName({
            name: ctx.params.name,
          }),
        });

        ctx.response.body = stringifyJSON({
          categories: data,
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

    this.#categories.get("/:id/products", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const data = await Get<Array<Product>>(this.#Container, {
          id:
            `products_by_category_${ctx.state.request_data.publicId}-${ctx.params.id}`,
          promise: this.#Container.CategoryLinkService.GetProducts({
            id: ctx.params.id,
          }),
        });

        const productsPromises = data.map(async (product) => {
          const price = await this.#Container.PriceService.GetByProduct({
            productId: product.publicId!,
          });

          product.price = Dinero({
            amount: parseInt(price.amount.toString()),
            currency: ctx.state.request_data.currency,
          }).getAmount();

          return product;
        });

        const products = await Promise.all(productsPromises);

        ctx.response.body = stringifyJSON({
          products,
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

    this.#categories.get("/:id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const data = await Get<Category>(this.#Container, {
          id: `category_${ctx.state.request_data.publicId}-${ctx.params.id}`,
          promise: this.#Container.CategoryService.Get({
            id: ctx.params.id,
          }),
        });

        ctx.response.body = stringifyJSON({
          categories: data,
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
  }

  routes() {
    return this.#categories.routes();
  }
}
