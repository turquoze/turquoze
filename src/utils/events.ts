import Container from "../services/mod.ts";
import { TurquozeEvent } from "./types.ts";

export default function addEvents(container: Container) {
  container.NotificationService.add(
    ["Product.Created", "Product.Updated"],
    (_event: TurquozeEvent, id: string) => {
      container.ProductService.Get({ id }).then((product) => {
        const index = container.Shop.search_index;
        const productToIndex = {
          ...product,
        };
        delete productToIndex.public_id;

        container.SearchService.ProductIndex({
          index: index,
          products: [productToIndex],
        }).then((task) => {
          console.info(task);
        }).catch((error) => console.log(`could not finish event`, error));
      }).catch((error) => console.log(`could not finish event`, error));
    },
  );

  container.NotificationService.add(
    ["Product.Deleted"],
    (_event: TurquozeEvent, id: string) => {
      container.ProductService.Get({ id }).then((product) => {
        const index = container.Shop.search_index;
        container.SearchService.ProductRemove({
          index: index,
          id: product.id.toString(),
        }).then((task) => {
          console.info(task);
        }).catch((error) => console.log(`could not finish event`, error));
      }).catch((error) => console.log(`could not finish event`, error));
    },
  );

  container.NotificationService.add(
    ["TEST_EVENT"],
    (_event: TurquozeEvent, id: string) => {
      console.log(`NOTIFIED: ${id}`);
    },
  );
}
