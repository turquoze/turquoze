import { MeiliSearch, Router } from "../../deps.ts";
import type Container from "../../services/mod.ts";
import { ErrorHandler } from "../../utils/errors.ts";
import { TurquozeState } from "../../utils/types.ts";

export default class SettingsRoutes {
  #settings: Router<TurquozeState>;
  #Container: typeof Container;
  constructor(container: typeof Container) {
    this.#Container = container;
    this.#settings = new Router<TurquozeState>({
      prefix: "/settings",
    });

    this.#settings.post("/re-index", async (ctx) => {
      try {
        const products = await this.#Container.ProductService.GetMany({
          limit: 99999, //TODO: get all products
        });

        const client = new MeiliSearch({
          host: this.#Container.Shop.settings.meilisearch.host,
          apiKey: this.#Container.Shop.settings.meilisearch.api_key,
        });

        await this.#Container.SearchService.ProductIndex({
          index: "products",
          products: products,
        }, client);

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
    return this.#settings.routes();
  }
}
