import { Router } from "@oakserver/oak";
import RoleGuard from "../../middleware/roleGuard.ts";
import type Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";

import { Delete, Get, stringifyJSON, Update } from "../../utils/utils.ts";
import { UuidSchema } from "../../utils/validator.ts";
import { parse } from "valibot";
import {
  Category,
  CategoryLink,
  insertCategoryLinkSchema,
  insertCategorySchema,
} from "../../utils/schema.ts";

export default class CategoriesRoutes {
  #categories: Router;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#categories = new Router({
      prefix: "/categories",
    });

    this.#categories.get("/", RoleGuard("VIEWER"), async (ctx) => {
      try {
        const offset = parseInt(
          ctx.request.url.searchParams.get("offset") ?? "",
        );
        const limit = parseInt(ctx.request.url.searchParams.get("limit") ?? "");

        const data = await this.#Container.CategoryService.GetMany({
          shop: ctx.state.request_data.publicId!,
          limit: isNaN(limit) ? undefined : limit,
          offset: isNaN(offset) ? undefined : offset,
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

    this.#categories.post("/", RoleGuard("ADMIN"), async (ctx) => {
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

        category.shop = ctx.state.request_data.publicId;

        const posted = parse(insertCategorySchema, category);

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

    this.#categories.get("/:id", RoleGuard("VIEWER"), async (ctx) => {
      try {
        parse(UuidSchema, {
          id: ctx.params.id,
        });

        const data = await Get<Category>(this.#Container, {
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

    this.#categories.put("/:id", RoleGuard("ADMIN"), async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        parse(UuidSchema, {
          id: ctx.params.id,
        });

        const body = ctx.request.body();
        let category: Category;
        if (body.type === "json") {
          category = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        category.publicId = ctx.params.id;
        category.shop = ctx.state.request_data.publicId;

        const posted = parse(insertCategorySchema, category);

        const data = await Update<Category>(this.#Container, {
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

    this.#categories.post("/link", RoleGuard("ADMIN"), async (ctx) => {
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

        const posted = parse(insertCategoryLinkSchema, categoryLink);

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

    this.#categories.delete("/link", RoleGuard("ADMIN"), async (ctx) => {
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

        const posted = parse(insertCategoryLinkSchema, categoryLink);

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

    this.#categories.delete("/:id", RoleGuard("ADMIN"), async (ctx) => {
      try {
        parse(UuidSchema, {
          id: ctx.params.id,
        });

        const data = await Delete(this.#Container, {
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
