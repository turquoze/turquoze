import { Router } from "../../deps.ts";
import type Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";
import { Product, TurquozeState } from "../../utils/types.ts";

import { Delete, stringifyJSON, Update } from "../../utils/utils.ts";
import { ProductSchema, UuidSchema } from "../../utils/validator.ts";

export default class ProductsRoutes {
  #products: Router<TurquozeState>;
  #Container: typeof Container;
  constructor(container: typeof Container) {
    this.#Container = container;
    this.#products = new Router<TurquozeState>({
      prefix: "/products",
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

        product.shop = ctx.state.shop;

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

        product.public_id = ctx.params.id;
        product.shop = ctx.state.shop;

        await ProductSchema.validate(product);
        const posted: Product = await ProductSchema.cast(product);

        const data = await Update<Product>({
          id: `product_${ctx.state.request_data.public_id}-${product.id}`,
          promise: this.#Container.ProductService.Update({
            data: posted,
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

    this.#products.delete("/:id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        await Delete({
          id: `product_${ctx.state.request_data.public_id}-${ctx.params.id}`,
          promise: this.#Container.ProductService.Delete({ id: ctx.params.id }),
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
  }

  routes() {
    return this.#products.routes();
  }
}
