import RoleGuard from "../../middleware/roleGuard.ts";
import type Container from "../../services/mod.ts";
import { Hono, parse } from "../../deps.ts";

import {
  Delete,
  Get,
  jsonResponse,
  stringifyJSON,
  Update,
} from "../../utils/utils.ts";
import { UuidSchema } from "../../utils/validator.ts";
import {
  Category,
  insertCategoryLinkSchema,
  insertCategorySchema,
} from "../../utils/validator.ts";

export default class CategoriesRoutes {
  #categories: Hono;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#categories = new Hono({ strict: false });

    this.#categories.get("/", RoleGuard("VIEWER"), async (ctx) => {
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

      return jsonResponse(
        stringifyJSON({
          categories: data,
        }),
        200,
      );
    });

    this.#categories.post("/", RoleGuard("ADMIN"), async (ctx) => {
      const category = await ctx.req.json();
      //@ts-expect-error not on type
      category.shop = ctx.get("request_data").publicId;

      const posted = parse(insertCategorySchema, category);

      const data = await this.#Container.CategoryService.Create({
        data: posted,
      });

      return jsonResponse(
        stringifyJSON({
          categories: data,
        }),
        200,
      );
    });

    this.#categories.get("/:id", RoleGuard("VIEWER"), async (ctx) => {
      const { id } = parse(UuidSchema, {
        id: ctx.req.param("id"),
      });

      const data = await Get<Category>(this.#Container, {
        id: `category_${id}`,
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
    });

    this.#categories.put("/:id", RoleGuard("ADMIN"), async (ctx) => {
      const { id } = parse(UuidSchema, {
        id: ctx.req.param("id"),
      });

      const category = await ctx.req.json();

      category.publicId = id;
      //@ts-expect-error not on type
      category.shop = ctx.get("request_data").publicId;

      const posted = parse(insertCategorySchema, category);

      await Update<Category>(this.#Container, {
        id: `category_${id}`,
        promise: this.#Container.CategoryService.Update({
          data: posted,
          id: id,
        }),
      });

      return jsonResponse(
        stringifyJSON({
          categories: posted,
        }),
        200,
      );
    });

    this.#categories.post("/link", RoleGuard("ADMIN"), async (ctx) => {
      const categoryLink = await ctx.req.json();

      const posted = parse(insertCategoryLinkSchema, categoryLink);

      await this.#Container.CategoryLinkService.Link({
        data: posted,
      });

      ctx.res.headers.set("content-type", "application/json");
      return ctx.json({}, 201);
    });

    this.#categories.delete("/link", RoleGuard("ADMIN"), async (ctx) => {
      const categoryLink = await ctx.req.json();
      const posted = parse(insertCategoryLinkSchema, categoryLink);

      await this.#Container.CategoryLinkService.Delete({
        data: posted,
        id: "",
      });

      ctx.res.headers.set("content-type", "application/json");
      return ctx.json({}, 201);
    });

    this.#categories.delete("/:id", RoleGuard("ADMIN"), async (ctx) => {
      const { id } = parse(UuidSchema, {
        id: ctx.req.param("id"),
      });

      await Delete(this.#Container, {
        id: `category_${id}`,
        promise: this.#Container.CategoryService.Delete({
          id: id,
        }),
      });

      ctx.res.headers.set("content-type", "application/json");
      return ctx.json({}, 201);
    });
  }

  routes() {
    return this.#categories;
  }
}
