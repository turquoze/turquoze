import { Application, assert, assertEquals } from "../../deps.ts";

import InventoriesRoutes from "./inventories.ts";
import { Inventory } from "../../utils/types.ts";
import Container from "../../services/mod.ts";

let ID = "";
const container = new Container();

Deno.test({
  name: "Inventories - Create | ok",
  async fn() {
    const app = new Application();

    app.use(new InventoriesRoutes(container).routes());

    const data = JSON.stringify({
      product: "f1d7548e-8d6d-4287-b446-29627e8a3442",
      quantity: 2,
      warehouse: "a03a718d-619c-415c-933d-9ebcdff35e3c",
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
    ID = inventories.id;
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
    assertEquals(inventories.id, ID);
  },
});

Deno.test({
  name: "Inventories - Put | ok",
  async fn() {
    const app = new Application();

    app.use(new InventoriesRoutes(container).routes());

    const data = JSON.stringify({
      product: "f1d7548e-8d6d-4287-b446-29627e8a3442",
      quantity: 10,
      warehouse: "a03a718d-619c-415c-933d-9ebcdff35e3c",
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
    assertEquals(inventories.id, ID);
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
