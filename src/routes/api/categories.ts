import { Router } from "../../deps.ts";
import ICategoryLinkService from "../../services/interfaces/categoryLinkService.ts";
import ICategoryService from "../../services/interfaces/categoryService.ts";

import { stringifyJSON } from "../../utils/utils.ts";
import { CategoryLinkSchema, CategorySchema } from "../../utils/validator.ts";

export default class CategoriesRoutes {
  #categories: Router;
  #CategoryService: ICategoryService;
  #CategoryLinkService: ICategoryLinkService;
  constructor(
    categoryService: ICategoryService,
    categoryLinkService: ICategoryLinkService,
  ) {
    this.#CategoryService = categoryService;
    this.#CategoryLinkService = categoryLinkService;
    this.#categories = new Router({
      prefix: "/categories",
    });

    this.#categories.get("/", async (ctx) => {
      try {
        const data = await this.#CategoryService.GetMany({});
        ctx.response.body = stringifyJSON({
          categories: data,
        });
      } catch (error) {
        ctx.response.body = JSON.stringify(error);
      }
    });

    this.#categories.post("/", async (ctx) => {
      try {
        const posted = {
          id: "",
          name: "test",
          region: ctx.state.region,
        };

        await CategorySchema.validate(posted);

        const data = await this.#CategoryService.Create({
          data: posted,
        });
        ctx.response.body = stringifyJSON({
          categories: data,
        });
      } catch (error) {
        ctx.response.body = JSON.stringify(error);
      }
    });

    this.#categories.get("/:id", async (ctx) => {
      try {
        const data = await this.#CategoryService.Get({ id: ctx.params.id });
        ctx.response.body = stringifyJSON({
          categories: data,
        });
      } catch (error) {
        ctx.response.body = JSON.stringify(error);
      }
    });

    this.#categories.put("/:id", async (ctx) => {
      try {
        const posted = {
          id: "",
          name: "test update",
          region: ctx.state.region,
        };

        await CategorySchema.validate(posted);

        const data = await this.#CategoryService.Update({
          data: posted,
        });
        ctx.response.body = stringifyJSON({
          categories: data,
        });
      } catch (error) {
        ctx.response.body = JSON.stringify(error);
      }
    });

    this.#categories.delete("/:id", async (ctx) => {
      try {
        const data = await this.#CategoryService.Delete({ id: ctx.params.id });
        ctx.response.body = stringifyJSON({
          categories: data,
        });
      } catch (error) {
        ctx.response.body = JSON.stringify(error);
      }
    });

    this.#categories.post("/link", async (ctx) => {
      try {
        const posted = {
          category: "e6cd1629-9a7d-44b6-8816-daf8dbeb61a3",
          product: "12c8eb72-c4b2-40eb-a30d-bafd436ea60e",
        };

        await CategoryLinkSchema.validate(posted);

        const data = await this.#CategoryLinkService.Link({
          data: posted,
        });
        ctx.response.body = stringifyJSON({
          link: data,
        });
      } catch (error) {
        ctx.response.body = JSON.stringify(error);
      }
    });

    this.#categories.delete("/link", async (ctx) => {
      try {
        const posted = {
          category: "e6cd1629-9a7d-44b6-8816-daf8dbeb61a3",
          product: "12c8eb72-c4b2-40eb-a30d-bafd436ea60e",
        };

        await CategoryLinkSchema.validate(posted);

        await this.#CategoryLinkService.Delete({
          data: posted,
        });
        ctx.response.status = 201;
      } catch (error) {
        ctx.response.body = JSON.stringify(error);
      }
    });
  }

  routes() {
    return this.#categories.routes();
  }
}
