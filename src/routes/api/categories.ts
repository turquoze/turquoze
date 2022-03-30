import { Router } from "../../deps.ts";
import Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";
import { Category } from "../../utils/types.ts";

import { stringifyJSON } from "../../utils/utils.ts";
import {
  CategoryLinkSchema,
  CategorySchema,
  UuidSchema,
} from "../../utils/validator.ts";

export default class CategoriesRoutes {
  #categories: Router;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#categories = new Router({
      prefix: "/categories",
    });

    this.#categories.get("/", async (ctx) => {
      try {
        const data = await this.#Container.CategoryService.GetMany({});
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

        category.region = ctx.state.region;

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

    this.#categories.get("/:id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const data = await this.#Container.CategoryService.Get({
          id: ctx.params.id,
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

        category.id = ctx.params.id;
        category.region = ctx.state.region;

        await CategorySchema.validate(category);
        const posted: Category = await CategorySchema.cast(category);

        const data = await this.#Container.CategoryService.Update({
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

    this.#categories.delete("/:id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const data = await this.#Container.CategoryService.Delete({
          id: ctx.params.id,
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
        const posted = {
          category: "e6cd1629-9a7d-44b6-8816-daf8dbeb61a3",
          product: "f1d7548e-8d6d-4287-b446-29627e8a3442",
        };

        await CategoryLinkSchema.validate(posted);

        ctx.response.status = 201;
        ctx.response.headers.set("content-type", "application/json");

        /*const data = await this.#CategoryLinkService.Link({
          data: posted,
        });
        ctx.response.body = stringifyJSON({
          link: data,
        });*/
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
        const posted = {
          category: "e6cd1629-9a7d-44b6-8816-daf8dbeb61a3",
          product: "f1d7548e-8d6d-4287-b446-29627e8a3442",
        };

        await CategoryLinkSchema.validate(posted);

        ctx.response.status = 201;
        ctx.response.headers.set("content-type", "application/json");

        /*await this.#CategoryLinkService.Delete({
          data: posted,
        });
        ctx.response.status = 201;*/
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
