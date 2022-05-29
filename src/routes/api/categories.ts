import { Router } from "../../deps.ts";
import Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";
import { Category, CategoryLink, Product } from "../../utils/types.ts";

import { Delete, Get, stringifyJSON, Update } from "../../utils/utils.ts";
import {
  CategoryLinkSchema,
  CategorySchema,
  UuidSchema,
} from "../../utils/validator.ts";

export default class CategoriesRoutes {
  #categories: Router;
  #Container: typeof Container;
  constructor(container: typeof Container) {
    this.#Container = container;
    this.#categories = new Router({
      prefix: "/categories",
    });

    this.#categories.get("/", async (ctx) => {
      try {
        const data = await Get<Array<Category>>({
          id: `categoryGetMany-${10}-${10}`,
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

    this.#categories.post("/", async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const body = ctx.request.body();
        let category: Category;
        if (body.type === "json") {
          category = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        category.shop = ctx.state.region;

        await CategorySchema.validate(category);
        const posted: Category = await CategorySchema.cast(category);

        const data = await this.#Container.CategoryService.Create({
          data: posted,
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
          id: `category_name_${ctx.params.name}`,
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
          id: `products_by_category_${ctx.params.id}`,
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
          id: `category_${ctx.params.id}`,
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

    this.#categories.put("/:id", async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const body = ctx.request.body();
        let category: Category;
        if (body.type === "json") {
          category = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        category.public_id = ctx.params.id;
        category.shop = ctx.state.region;

        await CategorySchema.validate(category);
        const posted: Category = await CategorySchema.cast(category);

        const data = await Update<Category>({
          id: `category_${ctx.params.id}`,
          promise: this.#Container.CategoryService.Update({
            data: posted,
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

    this.#categories.post("/link", async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const body = ctx.request.body();
        let categoryLink: CategoryLink;
        if (body.type === "json") {
          categoryLink = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        await CategoryLinkSchema.validate(categoryLink);
        const posted: CategoryLink = await CategoryLinkSchema.cast(
          categoryLink,
        );

        await this.#Container.CategoryLinkService.Link({
          data: posted,
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

    this.#categories.delete("/link", async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const body = ctx.request.body();
        let categoryLink: CategoryLink;
        if (body.type === "json") {
          categoryLink = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        await CategoryLinkSchema.validate(categoryLink);
        const posted: CategoryLink = await CategoryLinkSchema.cast(
          categoryLink,
        );

        await this.#Container.CategoryLinkService.Delete({
          data: posted,
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

    this.#categories.delete("/:id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const data = await Delete({
          id: `category_${ctx.params.id}`,
          promise: this.#Container.CategoryService.Delete({
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
