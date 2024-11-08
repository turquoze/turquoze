import { log, MeiliSearch } from "../deps.ts";
import type Container from "../services/mod.ts";
import { Shop } from "./validator.ts";

export function reIndex(id: string, shop: Shop, container: Container) {
  container.ProductService.Get({ id }).then((product) => {
    const index = shop.searchIndex;
    const productToIndex = {
      ...product,
    };
    delete productToIndex.publicId;

    const client = new MeiliSearch({
      //@ts-ignore not on type
      host: shop.settings.meilisearch.host,
      //@ts-ignore not on type
      apiKey: shop.settings.meilisearch.api_key,
    });

    container.SearchService.ProductIndex({
      index: index!,
      //@ts-ignore not on type
      products: [productToIndex],
    }, client).then((task) => {
      console.info(task);
    }).catch((error) => log.error(`could not finish event`, error));
  }).catch((error) => log.error(`could not finish event`, error));
}

export function removeProduct(id: string, shop: Shop, container: Container) {
  container.ProductService.Get({ id }).then((product) => {
    const index = shop.searchIndex;

    const client = new MeiliSearch({
      //@ts-ignore not on type
      host: shop.settings.meilisearch.host,
      //@ts-ignore not on type
      apiKey: shop.settings.meilisearch.api_key,
    });

    container.SearchService.ProductRemove({
      index: index!,
      id: product.publicId!.toString(),
    }, client).then((task) => {
      console.info(task);
    }).catch((error) => log.error(`could not finish event`, error));
  }).catch((error) => log.error(`could not finish event`, error));
}
