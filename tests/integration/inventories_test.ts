import { assert, assertEquals } from "../test_deps.ts";

import InventoriesRoutes from "../../src/routes/admin/inventories.ts";
import app from "../test_app.ts";
import { Inventory } from "../../src/utils/schema.ts";

let ID = "";

app.use(new InventoriesRoutes(app.state.container).routes());

Deno.test({
  name: "Inventories - Create | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const data = JSON.stringify({
      product: "d72f032b-b91b-4dbf-811c-a01ab0938358",
      quantity: 2,
      warehouse: "5690efcf-07a6-4e93-a162-01d45a376dbe",
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
    ID = inventories.publicId!;
  },
});

Deno.test({
  name: "Inventories - Get | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.handle(
      new Request(`http://127.0.0.1/inventories/${ID}`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { inventories }: { inventories: Inventory } = await response?.json();
    assertEquals(inventories.publicId, ID);
  },
});

Deno.test({
  name: "Inventories - Put | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
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
    assertEquals(inventories.publicId, ID);
  },
});

Deno.test({
  name: "Inventories - Delete | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.handle(
      new Request(`http://127.0.0.1/inventories/${ID}`, {
        method: "DELETE",
      }),
    );

    assert(response?.ok);
  },
});
