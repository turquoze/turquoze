import { Router } from "../../deps.ts";
import Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";
import { Product, Search } from "../../utils/types.ts";

import { stringifyJSON } from "../../utils/utils.ts";
import {
  ProductSchema,
  SearchSchema,
  UuidSchema,
} from "../../utils/validator.ts";

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

    this.#products.post("/search", async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const body = ctx.request.body();
        let query: Search;
        if (body.type === "json") {
          query = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        query.region = ctx.state.region;

        await SearchSchema.validate(query);
        const posted: Search = await SearchSchema.cast(query);

        const data = await this.#Container.SearchService.ProductSearch({
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

    this.#products.post("/", async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const body = ctx.request.body();
        let product: Product;
        if (body.type === "json") {
          product = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        product.region = ctx.state.region;

        await ProductSchema.validate(product);
        const posted: Product = await ProductSchema.cast(product);

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
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const body = ctx.request.body();
        let product: Product;
        if (body.type === "json") {
          product = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        product.id = ctx.params.id;
        product.region = ctx.state.region;

        await ProductSchema.validate(product);
        const posted: Product = await ProductSchema.cast(product);

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
        await UuidSchema.validate({
          id: ctx.params.id,
        });

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
        await UuidSchema.validate({
          id: ctx.params.id,
        });

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
