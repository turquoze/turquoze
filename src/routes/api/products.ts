import { Router } from "@oakserver/oak";
import type Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";
import { Search, TurquozeState } from "../../utils/types.ts";
import Dinero from "https://cdn.skypack.dev/dinero.js@1.9.1";
import { MeiliSearch } from "meilisearch";

import { Get, stringifyJSON } from "../../utils/utils.ts";
import { SearchSchema, UuidSchema } from "../../utils/validator.ts";
import { parse } from "valibot";
import { Product } from "../../utils/schema.ts";

export default class ProductsRoutes {
  #products: Router<TurquozeState>;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#products = new Router<TurquozeState>({
      prefix: "/products",
    });

    this.#products.get("/", async (ctx) => {
      try {
        const offset = parseInt(
          ctx.request.url.searchParams.get("offset") ?? "",
        );
        const limit = parseInt(ctx.request.url.searchParams.get("limit") ?? "");

        const data = await this.#Container.ProductService.GetMany({
          shop: ctx.state.request_data.publicId,
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
            currency: ctx.state.request_data.currency,
          }).getAmount();

          return localProduct;
        });

        const products = await Promise.all(productsPromises);

        ctx.response.body = stringifyJSON({
          products,
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

        query.index = ctx.state.request_data.settings.meilisearch.index;
        const posted = parse(SearchSchema, query);

        const client = new MeiliSearch({
          host: this.#Container.Shop.settings.meilisearch.host,
          apiKey: this.#Container.Shop.settings.meilisearch.api_key,
        });

        const data = await this.#Container.SearchService.ProductSearch(
          posted,
          client,
        );

        ctx.response.body = stringifyJSON({
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
              currency: ctx.state.request_data.currency,
            }).getAmount();

            return product;
          });

          const data = await Promise.all(productsPromises);

          ctx.response.body = stringifyJSON({
            products: data,
          });
        } else {
          return ctx.response.body = stringifyJSON({
            products: [],
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

        const product: Product = {
          ...data,
          price: 0,
        };

        const price = await this.#Container.PriceService.GetByProduct({
          productId: data.publicId!,
        });

        product.price = Dinero({
          amount: parseInt((price.amount ?? -1).toString()),
          currency: ctx.state.request_data.currency,
        }).getAmount();

        ctx.response.body = stringifyJSON({
          products: product,
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

    this.#products.get("/byparent/:id", async (ctx) => {
      try {
        parse(UuidSchema, {
          id: ctx.params.id,
        });

        const data = await this.#Container.ProductService.GetVariantsByParent({
          id: ctx.params.id,
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
            currency: ctx.state.request_data.currency,
          }).getAmount();

          return localProduct;
        });

        ctx.response.body = stringifyJSON({
          products: dataWPrice,
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

    this.#products.get("/inventory/:id", async (ctx) => {
      try {
        parse(UuidSchema, {
          id: ctx.params.id,
        });

        const data = await this.#Container.InventoryService
          .GetInventoryByProduct({
            id: ctx.params.id,
          });

        ctx.response.body = stringifyJSON({
          inventories: data,
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

    this.#products.get("/price/:id", async (ctx) => {
      try {
        parse(UuidSchema, {
          id: ctx.params.id,
        });

        const data = await this.#Container.PriceService.GetByProduct({
          productId: ctx.params.id,
        });

        data.amount = Dinero({
          amount: parseInt((data.amount ?? -1).toString()),
          currency: ctx.state.request_data.currency,
        }).getAmount();

        ctx.response.body = stringifyJSON({
          price: data,
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
        parse(UuidSchema, {
          id: ctx.params.id,
        });

        const data = await Get<Product>(this.#Container, {
          id: `product_${ctx.state.request_data.publicId}-${ctx.params.id}`,
          //@ts-ignore not on type
          promise: this.#Container.ProductService.Get({
            id: ctx.params.id,
          }),
        });

        const price = await this.#Container.PriceService.GetByProduct({
          productId: ctx.params.id,
        });

        data.price = Dinero({
          amount: parseInt((price.amount ?? -1).toString()),
          currency: ctx.state.request_data.currency,
        }).getAmount();

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
  }

  routes() {
    return this.#products.routes();
  }
}
