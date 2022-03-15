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
        ctx.response.status = 400;
        ctx.response.body = JSON.stringify(error);
      }
    });

    this.#categories.post("/", async (ctx) => {
      try {
        const posted = {
          id: "156e4529-8131-46bf-b0f7-03863a608214",
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
        ctx.response.status = 400;
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
        ctx.response.status = 400;
        ctx.response.body = JSON.stringify(error);
      }
    });

    this.#categories.put("/:id", async (ctx) => {
      try {
        const posted = {
          id: ctx.params.id,
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
        ctx.response.status = 400;
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
        ctx.response.status = 400;
        ctx.response.body = JSON.stringify(error);
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

        /*const data = await this.#CategoryLinkService.Link({
          data: posted,
        });
        ctx.response.body = stringifyJSON({
          link: data,
        });*/
      } catch (error) {
        ctx.response.status = 400;
        ctx.response.body = JSON.stringify(error);
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

        /*await this.#CategoryLinkService.Delete({
          data: posted,
        });
        ctx.response.status = 201;*/
      } catch (error) {
        ctx.response.status = 400;
        ctx.response.body = JSON.stringify(error);
      }
    });
  }

  routes() {
    return this.#categories.routes();
  }
}
