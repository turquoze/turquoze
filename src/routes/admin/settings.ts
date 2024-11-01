import { Hono, MeiliSearch } from "../../deps.ts";
import RoleGuard from "../../middleware/roleGuard.ts";
import type Container from "../../services/mod.ts";
import { ErrorHandler } from "../../utils/errors.ts";
import { Product, SearchProduct } from "../../utils/validator.ts";

export default class SettingsRoutes {
  #settings: Hono;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#settings = new Hono({ strict: false });

    this.#settings.use(RoleGuard("ADMIN"));

    this.#settings.post("/re-index", async (ctx) => {
      try {
        const products = await this.#Container.ProductService.GetMany({
          limit: 99999, //TODO: get all products
          //@ts-expect-error not on type
          shop: ctx.get("request_data").publicId,
        });

        const client = new MeiliSearch({
          //@ts-ignore unkown type
          host: this.#Container.Shop.settings!.meilisearch.host,
          //@ts-ignore unkown type
          apiKey: this.#Container.Shop.settings!.meilisearch.api_key,
        });

        const productsMappedPromises = products.map(async (product) => {
          const localProduct: Product = {
            ...product,
            price: 0,
          };
          const price = await this.#Container.PriceService.GetByProduct({
            productId: product.publicId!,
          });

          localProduct.price = price.amount ?? -1;

          const obj: SearchProduct = {
            ...localProduct,
            id: Number(product.id!),
          };

          delete obj.publicId;

          return obj;
        });

        const productsMapped: Array<SearchProduct> = await Promise.all(
          productsMappedPromises,
        );

        await this.#Container.SearchService.ProductIndex({
          //@ts-ignore unkown type
          index: this.#Container.Shop.settings!.meilisearch.index,
          products: productsMapped,
        }, client);

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({}, 201);
      } catch (error) {
        const data = ErrorHandler(error as Error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#settings.post("/filters", async (ctx) => {
      try {
        const filters = await ctx.req.json();

        const client = new MeiliSearch({
          //@ts-ignore unkown type
          host: this.#Container.Shop.settings!.meilisearch.host,
          //@ts-ignore unkown type
          apiKey: this.#Container.Shop.settings!.meilisearch.api_key,
        });

        await this.#Container.SearchService.ProductFilterableAttributes(
          "products",
          filters,
          client,
        );

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({}, 201);
      } catch (error) {
        const data = ErrorHandler(error as Error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });
  }

  routes() {
    return this.#settings;
  }
}
