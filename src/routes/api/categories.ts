import { Router } from "../../deps.ts";
import Container from "../../services/mod.ts";
import { ErrorHandler } from "../../utils/errors.ts";
import { Category, Product, TurquozeState } from "../../utils/types.ts";

import { Get, stringifyJSON } from "../../utils/utils.ts";
import { UuidSchema } from "../../utils/validator.ts";

export default class CategoriesRoutes {
  #categories: Router<TurquozeState>;
  #Container: typeof Container;
  constructor(container: typeof Container) {
    this.#Container = container;
    this.#categories = new Router<TurquozeState>({
      prefix: "/categories",
    });

    this.#categories.get("/", async (ctx) => {
      try {
        const data = await Get<Array<Category>>({
          id: `categoryGetMany-${ctx.state.request_data.public_id}-${10}-${10}`,
          promise: this.#Container.CategoryService.GetMany({}),
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
        const data = await Get<Category>({
          id:
            `category_name_${ctx.state.request_data.public_id}-${ctx.params.name}`,
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

        const data = await Get<Array<Product>>({
          id:
            `products_by_category_${ctx.state.request_data.public_id}-${ctx.params.id}`,
          promise: this.#Container.CategoryLinkService.GetProducts({
            id: ctx.params.id,
          }),
        });

        ctx.response.body = stringifyJSON({
          products: data,
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

        const data = await Get<Category>({
          id: `category_${ctx.state.request_data.public_id}-${ctx.params.id}`,
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
