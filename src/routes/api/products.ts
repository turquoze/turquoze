import { Router } from "../../deps.ts";
import Container from "../../services/mod.ts";
import { ErrorHandler } from "../../utils/errors.ts";

import { stringifyJSON } from "../../utils/utils.ts";
import { ProductSchema } from "../../utils/validator.ts";

export default class ProductsRoutes {
  #products: Router;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#products = new Router({
      prefix: "/products",
    });

    this.#products.get("/", async (ctx) => {
      try {
        const data = await this.#Container.ProductService.GetMany({});
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

    this.#products.post("/", async (ctx) => {
      try {
        const posted = {
          id: crypto.randomUUID(),
          active: true,
          images: [],
          price: 203300,
          title: "test product",
          description: "test product",
          region: ctx.state.region,
        };

        await ProductSchema.validate(posted);

        posted.id = "";

        const data = await this.#Container.ProductService.Create({
          data: posted,
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

    this.#products.put("/:id", async (ctx) => {
      try {
        const posted = {
          id: ctx.params.id,
          active: true,
          images: ["https://test.com"],
          price: 203300,
          title: "Test product update",
          description: "test description update",
          region: ctx.state.region,
        };

        await ProductSchema.validate(posted);

        const data = await this.#Container.ProductService.Update({
          data: posted,
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

    this.#products.get("/:id", async (ctx) => {
      try {
        const data = await this.#Container.ProductService.Get({
          id: ctx.params.id,
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

    this.#products.delete("/:id", async (ctx) => {
      try {
        await this.#Container.ProductService.Delete({ id: ctx.params.id });
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
  }

  routes() {
    return this.#products.routes();
  }
}
