import { assert, assertEquals } from "../test_deps.ts";

import InventoriesRoutes from "../../src/routes/admin/inventories.ts";
import app, { container } from "../test_app.ts";
import { Inventory } from "../../src/utils/validator.ts";
import { PRODUCT_ID } from "../test_utils.ts";
import { WAREHOUSE_ID } from "../test_utils.ts";

let ID = "";

app.route("/inventories", new InventoriesRoutes(container).routes());

Deno.test({
  name: "Inventories - Create | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const data = JSON.stringify({
      product: PRODUCT_ID,
      quantity: 2,
      warehouse: WAREHOUSE_ID,
    });

    const response = await app.request(
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
    const response = await app.request(
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
      product: PRODUCT_ID,
      quantity: 10,
      warehouse: WAREHOUSE_ID,
    });

    const response = await app.request(
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
    const response = await app.request(
      new Request(`http://127.0.0.1/inventories/${ID}`, {
        method: "DELETE",
      }),
    );

    assert(response?.ok);
  },
});
