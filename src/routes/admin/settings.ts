import { MeiliSearch, Router } from "../../deps.ts";
import RoleGuard from "../../middleware/roleGuard.ts";
import type Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";
import { Product, TurquozeState } from "../../utils/types.ts";

export default class SettingsRoutes {
  #settings: Router<TurquozeState>;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#settings = new Router<TurquozeState>({
      prefix: "/settings",
    });

    this.#settings.use(RoleGuard("ADMIN"));

    this.#settings.post("/re-index", async (ctx) => {
      try {
        const products = await this.#Container.ProductService.GetMany({
          limit: 99999, //TODO: get all products
        });

        const client = new MeiliSearch({
          host: this.#Container.Shop.settings.meilisearch.host,
          apiKey: this.#Container.Shop.settings.meilisearch.api_key,
        });

        const productsMapped: Array<Product> = products.map((product) => {
          const obj = {
            ...product,
            id: Number(product.id),
          };

          delete obj.public_id;

          return obj;
        });

        await this.#Container.SearchService.ProductIndex({
          index: "products",
          products: productsMapped,
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

    this.#settings.post("/filters", async (ctx) => {
      try {
        const body = ctx.request.body();
        let filters: Array<string>;
        if (body.type === "json") {
          filters = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        const client = new MeiliSearch({
          host: this.#Container.Shop.settings.meilisearch.host,
          apiKey: this.#Container.Shop.settings.meilisearch.api_key,
        });

        await this.#Container.SearchService.ProductFilterableAttributes(
          "products",
          filters,
          client,
        );

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
