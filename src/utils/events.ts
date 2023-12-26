import type Container from "../services/mod.ts";

export function reIndex(id: string, container: Container) {
  container.ProductService.Get({ id }).then((product) => {
    const index = container.Shop.searchIndex;
    const productToIndex = {
      ...product,
    };
    delete productToIndex.publicId;

    container.SearchService.ProductIndex({
      index: index!,
      //@ts-ignore not on type
      products: [productToIndex],
    }).then((task) => {
      console.info(task);
    }).catch((error) => console.log(`could not finish event`, error));
  }).catch((error) => console.log(`could not finish event`, error));
}

export function removeProduct(id: string, container: Container) {
  container.ProductService.Get({ id }).then((product) => {
    const index = container.Shop.searchIndex;
    container.SearchService.ProductRemove({
      index: index!,
      id: product.publicId!.toString(),
    }).then((task) => {
      console.info(task);
    }).catch((error) => console.log(`could not finish event`, error));
  }).catch((error) => console.log(`could not finish event`, error));
}
