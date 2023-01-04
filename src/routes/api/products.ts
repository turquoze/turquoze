import { MeiliSearch, Router } from "../../deps.ts";
import type Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";
import { Product, Search, TurquozeState } from "../../utils/types.ts";
import Dinero from "https://cdn.skypack.dev/dinero.js@1.9.1";

import { Get, stringifyJSON } from "../../utils/utils.ts";
import { SearchSchema, UuidSchema } from "../../utils/validator.ts";

export default class ProductsRoutes {
  #products: Router<TurquozeState>;
  #Container: typeof Container;
  constructor(container: typeof Container) {
    this.#Container = container;
    this.#products = new Router<TurquozeState>({
      prefix: "/products",
    });

    this.#products.get("/", async (ctx) => {
      try {
        const data = await Get<Array<Product>>({
          id: `productsGetMany-${ctx.state.request_data.public_id}-${10}-${10}`,
          promise: this.#Container.ProductService.GetMany({}),
        });

        const products = data.map((product) => {
          product.price = Dinero({
            amount: parseInt((product.price * 100).toString()),
            currency: ctx.state.request_data.currency,
          }).getAmount();

          return product;
        });

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

        await SearchSchema.validate(query);
        const posted: Search = await SearchSchema.cast(query);

        posted.index = ctx.state.request_data.settings.meilisearch.index;

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
              await this.#Container.ProductService.Get({ id: ids[i] }),
            );
          }

          const data = products.map((product) => {
            product.price = Dinero({
              amount: parseInt((product.price * 100).toString()),
              currency: ctx.state.request_data.currency,
            }).getAmount();

            return product;
          });

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

        data.price = Dinero({
          amount: parseInt((data.price * 100).toString()),
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

    this.#products.get("/byparent/:id", async (ctx) => {
      try {
        const data = await this.#Container.ProductService.GetVariantsByParent({
          id: ctx.params.id,
        });

        const dataWPrice = data.map((product) => {
          product.price = Dinero({
            amount: parseInt((product.price * 100).toString()),
            currency: ctx.state.request_data.currency,
          }).getAmount();

          return product;
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
        const data = await this.#Container.PriceService.GetByProduct({
          productId: ctx.params.id,
        });

        data.amount = Dinero({
          amount: parseInt((data.amount * 100).toString()),
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
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const data = await Get<Product>({
          id: `product_${ctx.state.request_data.public_id}-${ctx.params.id}`,
          promise: this.#Container.ProductService.Get({
            id: ctx.params.id,
          }),
        });

        data.price = Dinero({
          amount: parseInt((data.price * 100).toString()),
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
