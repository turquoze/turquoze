import { Router } from "../../deps.ts";
import Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";
import { Product, Search } from "../../utils/types.ts";

import { Delete, Get, stringifyJSON, Update } from "../../utils/utils.ts";
import {
  ProductSchema,
  SearchSchema,
  UuidSchema,
} from "../../utils/validator.ts";

export default class ProductsRoutes {
  #products: Router;
  #Container: typeof Container;
  constructor(container: typeof Container) {
    this.#Container = container;
    this.#products = new Router({
      prefix: "/products",
    });

    this.#products.get("/", async (ctx) => {
      try {
        const data = await Get<Array<Product>>({
          id: `productsGetMany-${10}-${undefined}`,
          promise: this.#Container.ProductService.GetMany({}),
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

        await SearchSchema.validate(query);
        const posted: Search = await SearchSchema.cast(query);

        const data = await this.#Container.SearchService.ProductSearch(posted);

        ctx.response.body = stringifyJSON({
          info: {
            hits: data.nbHits,
            offset: data.offset,
            limit: data.limit,
            facetsDistribution: data.facetsDistribution,
            exhaustiveNbHits: data.exhaustiveNbHits,
            exhaustiveFacetsCount: data.exhaustiveFacetsCount,
          },
          products: data.hits,
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

    this.#products.get("/byids", async (ctx) => {
      try {
        const params = (new URL(ctx.request.url)).searchParams;
        const id = params.get("ids");

        if (id == undefined || id == null) {
          return ctx.response.body = stringifyJSON({
            products: [],
          });
        } else {
          let ids: Array<string> = [];
          if (id.includes(",")) {
            ids = id.split(",");
          } else {
            ids.push(id);
          }

          const products = Array<Product>();

          for (const i in ids) {
            products.push(
              await this.#Container.ProductService.Get({ id: ids[i] }),
            );
          }

          ctx.response.body = stringifyJSON({
            products,
          });
        }
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

    this.#products.get("/byslug/:slug", async (ctx) => {
      try {
        const data = await this.#Container.ProductService.GetBySlug({
          slug: ctx.params.slug,
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
          id: `product_${product.id}`,
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

    this.#products.get("/:id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const data = await Get<Product>({
          id: `product_${ctx.params.id}`,
          promise: this.#Container.ProductService.Get({
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

    this.#products.delete("/:id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        await Delete({
          id: `product_${ctx.params.id}`,
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
