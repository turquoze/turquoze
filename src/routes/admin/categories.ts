import { Hono } from "hono";
import RoleGuard from "../../middleware/roleGuard.ts";
import type Container from "../../services/mod.ts";
import { ErrorHandler } from "../../utils/errors.ts";

import { Delete, Get, stringifyJSON, Update } from "../../utils/utils.ts";
import { UuidSchema } from "../../utils/validator.ts";
import { parse } from "valibot";
import {
  Category,
  insertCategoryLinkSchema,
  insertCategorySchema,
} from "../../utils/schema.ts";

export default class CategoriesRoutes {
  #categories: Hono;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#categories = new Hono();

    this.#categories.get("/", RoleGuard("VIEWER"), async (ctx) => {
      try {
        const offset = parseInt(
          new URL(ctx.req.raw.url).searchParams.get("offset") ?? "",
        );
        const limit = parseInt(
          new URL(ctx.req.raw.url).searchParams.get("limit") ?? "",
        );

        const data = await this.#Container.CategoryService.GetMany({
          //@ts-expect-error not on type
          shop: ctx.get("request_data").publicId!,
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

    this.#categories.post("/", RoleGuard("ADMIN"), async (ctx) => {
      try {
        const category = await ctx.req.json();
        //@ts-expect-error not on type
        category.shop = ctx.get("request_data").publicId;

        const posted = parse(insertCategorySchema, category);

        const data = await this.#Container.CategoryService.Create({
          data: posted,
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

    this.#categories.get("/:id", RoleGuard("VIEWER"), async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        const data = await Get<Category>(this.#Container, {
          id: `category_${id}`,
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

    this.#categories.put("/:id", RoleGuard("ADMIN"), async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        const category = await ctx.req.json();

        category.publicId = id;
        //@ts-expect-error not on type
        category.shop = ctx.get("request_data").publicId;

        const posted = parse(insertCategorySchema, category);

        const data = await Update<Category>(this.#Container, {
          id: `category_${id}`,
          promise: this.#Container.CategoryService.Update({
            data: posted,
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

    this.#categories.post("/link", RoleGuard("ADMIN"), async (ctx) => {
      try {
        const categoryLink = await ctx.req.json();

        const posted = parse(insertCategoryLinkSchema, categoryLink);

        await this.#Container.CategoryLinkService.Link({
          data: posted,
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

    this.#categories.delete("/link", RoleGuard("ADMIN"), async (ctx) => {
      try {
        const categoryLink = await ctx.req.json();
        const posted = parse(insertCategoryLinkSchema, categoryLink);

        await this.#Container.CategoryLinkService.Delete({
          data: posted,
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

    this.#categories.delete("/:id", RoleGuard("ADMIN"), async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        const data = await Delete(this.#Container, {
          id: `category_${id}`,
          promise: this.#Container.CategoryService.Delete({
            id: id,
          }),
        });

        return new Response(
          stringifyJSON({
            categories: data,
          }),
          {
            headers: {
              "content-type": "application/json",
            },
          },
        );
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
