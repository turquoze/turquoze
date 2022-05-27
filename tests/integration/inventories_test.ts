import { Application, assert, assertEquals } from "../test_deps.ts";

import InventoriesRoutes from "../../src/routes/api/inventories.ts";
import { Inventory } from "../../src/utils/types.ts";
import container from "../../src/services/mod.ts";

let ID = "";

Deno.test({
  name: "Inventories - Create | ok",
  async fn() {
    const app = new Application();

    app.use(new InventoriesRoutes(container).routes());

    const data = JSON.stringify({
      product: "00669ffc-bc13-47b1-aec6-f524611a657f",
      quantity: 2,
      warehouse: "f87bfb4f-985b-4965-9f6c-844b80d591ab",
    });

    const response = await app.handle(
      new Request(`http://127.0.0.1/inventories`, {
        headers: new Headers({
          "Content-Type": "application/json",
          "Content-Length": `${JSON.stringify(data).length}`,
        }),
        method: "POST",
        body: data,
      }),
    );

    assert(response?.ok);

    const { inventories }: { inventories: Inventory } = await response?.json();
    ID = inventories.public_id;
  },
});

Deno.test({
  name: "Inventories - Get | ok",
  async fn() {
    const app = new Application();

    app.use(new InventoriesRoutes(container).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/inventories/${ID}`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { inventories }: { inventories: Inventory } = await response?.json();
    assertEquals(inventories.public_id, ID);
  },
});

Deno.test({
  name: "Inventories - Put | ok",
  async fn() {
    const app = new Application();

    app.use(new InventoriesRoutes(container).routes());

    const data = JSON.stringify({
      product: "00669ffc-bc13-47b1-aec6-f524611a657f",
      quantity: 10,
      warehouse: "f87bfb4f-985b-4965-9f6c-844b80d591ab",
    });

    const response = await app.handle(
      new Request(`http://127.0.0.1/inventories/${ID}`, {
        headers: new Headers({
          "Content-Type": "application/json",
          "Content-Length": `${JSON.stringify(data).length}`,
        }),
        method: "PUT",
        body: data,
      }),
    );

    assert(response?.ok);

    const { inventories }: { inventories: Inventory } = await response?.json();
    assertEquals(inventories.public_id, ID);
  },
});

Deno.test({
  name: "Inventories - Delete | ok",
  async fn() {
    const app = new Application();

    app.use(new InventoriesRoutes(container).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/inventories/${ID}`, {
        method: "DELETE",
      }),
    );

    assert(response?.ok);
  },
});
