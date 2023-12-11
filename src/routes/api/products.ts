import { Hono } from "hono";
import type Container from "../../services/mod.ts";
import { ErrorHandler } from "../../utils/errors.ts";
import Dinero from "https://cdn.skypack.dev/dinero.js@1.9.1";
import { MeiliSearch } from "meilisearch";

import { Get, stringifyJSON } from "../../utils/utils.ts";
import { SearchSchema, UuidSchema } from "../../utils/validator.ts";
import { parse } from "valibot";
import { Product } from "../../utils/schema.ts";

export default class ProductsRoutes {
  #products: Hono;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#products = new Hono();

    this.#products.get("/", async (ctx) => {
      try {
        const offset = parseInt(
          new URL(ctx.req.raw.url).searchParams.get("offset") ?? "",
        );
        const limit = parseInt(
          new URL(ctx.req.raw.url).searchParams.get("limit") ?? "",
        );

        const data = await this.#Container.ProductService.GetMany({
          //@ts-expect-error not on type
          shop: ctx.get("request_data").publicId!,
          limit: isNaN(limit) ? undefined : limit,
          offset: isNaN(offset) ? undefined : offset,
        });

        const productsPromises = data.map(async (product) => {
          const localProduct: Product = {
            ...product,
            price: 0,
          };
          const price = await this.#Container.PriceService.GetByProduct({
            productId: product.publicId!,
          });

          localProduct.price = Dinero({
            amount: parseInt((price.amount ?? -1).toString()),
            //@ts-expect-error not on type
            currency: ctx.get("request_data").currency,
          }).getAmount();

          return localProduct;
        });

        const products = await Promise.all(productsPromises);

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          products,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#products.post("/search", async (ctx) => {
      try {
        const query = await ctx.req.json();

        //@ts-ignore not on type
        query.index = ctx.get("request_data").settings!.meilisearch.index;
        const posted = parse(SearchSchema, query);

        const client = new MeiliSearch({
          //@ts-ignore not on type
          host: this.#Container.Shop.settings.meilisearch.host,
          //@ts-ignore not on type
          apiKey: this.#Container.Shop.settings.meilisearch.api_key,
        });

        const data = await this.#Container.SearchService.ProductSearch(
          posted,
          client,
        );

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          info: {
            hits: data.estimatedTotalHits,
            offset: data.offset,
            limit: data.limit,
            facetsDistribution: data.facetDistribution,
            exhaustiveNbHits: data.totalHits,
            exhaustiveFacetsCount: data.facetDistribution,
          },
          products: data.hits,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#products.get("/byids", async (ctx) => {
      try {
        const params = (new URL(ctx.req.raw.url)).searchParams;
        const id = params.get("ids");

        if (id != null && id.length > 35) {
          let ids: Array<string> = [];
          if (id.includes(",")) {
            ids = id.split(",");
          } else {
            ids.push(id);
          }

          const products = Array<Product>();

          for (const i in ids) {
            products.push(
              //@ts-ignore not on type
              await this.#Container.ProductService.Get({ id: ids[i] }),
            );
          }

          const productsPromises = products.map(async (product) => {
            const price = await this.#Container.PriceService.GetByProduct({
              productId: product.publicId!,
            });

            product.price = Dinero({
              amount: parseInt((price.amount ?? -1).toString()),
              //@ts-expect-error not on type
              currency: ctx.get("request_data").currency,
            }).getAmount();

            return product;
          });

          const data = await Promise.all(productsPromises);

          ctx.json({
            products: data,
          });
        } else {
          return ctx.json({
            products: [],
          });
        }
        ctx.res.headers.set("content-type", "application/json");
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#products.get("/byslug/:slug", async (ctx) => {
      try {
        const data = await this.#Container.ProductService.GetBySlug({
          slug: ctx.req.param("slug"),
        });

        const product: Product = {
          ...data,
          price: 0,
        };

        const price = await this.#Container.PriceService.GetByProduct({
          productId: data.publicId!,
        });

        product.price = Dinero({
          amount: parseInt((price.amount ?? -1).toString()),
          //@ts-expect-error not on type
          currency: ctx.get("request_data").currency,
        }).getAmount();

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          products: product,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#products.get("/byparent/:id", async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        const data = await this.#Container.ProductService.GetVariantsByParent({
          id: id,
        });

        const dataWPrice = data.map(async (product) => {
          const localProduct: Product = {
            ...product,
            price: 0,
          };
          const price = await this.#Container.PriceService.GetByProduct({
            productId: product.publicId!,
          });

          localProduct.price = Dinero({
            amount: parseInt((price.amount ?? -1).toString()),
            //@ts-expect-error not on type
            currency: ctx.get("request_data").currency,
          }).getAmount();

          return localProduct;
        });

        return new Response(
          stringifyJSON({
            products: dataWPrice,
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

    this.#products.get("/inventory/:id", async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        const data = await this.#Container.InventoryService
          .GetInventoryByProduct({
            id: id,
          });

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          inventories: data,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#products.get("/price/:id", async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        const data = await this.#Container.PriceService.GetByProduct({
          productId: id,
        });

        data.amount = Dinero({
          amount: parseInt((data.amount ?? -1).toString()),
          //@ts-expect-error not on type
          currency: ctx.get("request_data").currency,
        }).getAmount();

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          price: data,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#products.get("/:id", async (ctx) => {
      try {
        const { id } = parse(UuidSchema, {
          id: ctx.req.param("id"),
        });

        const data = await Get<Product>(this.#Container, {
          //@ts-expect-error not on type
          id: `product_${ctx.get("request_data").publicId}-${id}`,
          //@ts-ignore not on type
          promise: this.#Container.ProductService.Get({
            id: id,
          }),
        });

        const price = await this.#Container.PriceService.GetByProduct({
          productId: id,
        });

        data.price = Dinero({
          amount: parseInt((price.amount ?? -1).toString()),
          //@ts-expect-error not on type
          currency: ctx.get("request_data").currency,
        }).getAmount();

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          products: data,
        });
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
    return this.#products;
  }
}
