import container from "../services/mod.ts";
import { TurquozeEvent } from "./types.ts";

export default function AddEvents() {
  container.NotificationService.add(
    ["CREATED_PRODUCT", "UPDATED_PRODUCT"],
    (_event: TurquozeEvent, id: string) => {
      container.ProductService.Get({ id }).then((product) => {
        const index = container.Shop.search_index;
        container.SearchService.ProductIndex({
          index: index,
          product: product,
        }).then((task) => {
          console.info(task);
        }).catch((error) => console.log(`could not finish event`, error));
      }).catch((error) => console.log(`could not finish event`, error));
    },
  );

  container.NotificationService.add(
    ["DELETED_PRODUCT"],
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