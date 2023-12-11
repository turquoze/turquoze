import { assert, assertEquals } from "../test_deps.ts";

import WarehousesRoutes from "../../src/routes/admin/warehouses.ts";
import app, { container } from "../test_app.ts";
import { Warehouse } from "../../src/utils/schema.ts";

let ID = "";

app.route("/warehouses", new WarehousesRoutes(container).routes());

Deno.test({
  name: "Warehouses - Create | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const data = JSON.stringify({
      address: "Test 1B",
      country: "Sweden",
      name: "Sweden A",
    });

    const response = await app.request(
      new Request(`http://127.0.0.1/warehouses`, {
        headers: new Headers({
          "Content-Type": "application/json",
          "Content-Length": `${JSON.stringify(data).length}`,
        }),
        method: "POST",
        body: data,
      }),
    );

    assert(response?.ok);

    const { warehouses }: { warehouses: Warehouse } = await response?.json();
    ID = warehouses.publicId!;
  },
});

Deno.test({
  name: "Warehouses - Get | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.request(
      new Request(`http://127.0.0.1/warehouses`, {
        method: "GET",
      }),
    );

    assert(response?.ok);
  },
});

Deno.test({
  name: "Warehouses - Get | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.request(
      new Request(`http://127.0.0.1/warehouses/${ID}`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { warehouses }: { warehouses: Warehouse } = await response?.json();
    assertEquals(warehouses.publicId, ID);
  },
});

Deno.test({
  name: "Warehouses - Put | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const data = JSON.stringify({
      address: "Test 1B - Update",
      country: "Sweden - Update",
      name: "Sweden A - Update",
    });

    const response = await app.request(
      new Request(`http://127.0.0.1/warehouses/${ID}`, {
        headers: new Headers({
          "Content-Type": "application/json",
          "Content-Length": `${JSON.stringify(data).length}`,
        }),
        method: "PUT",
        body: data,
      }),
    );

    assert(response?.ok);

    const { warehouses }: { warehouses: Warehouse } = await response?.json();
    assertEquals(warehouses.publicId, ID);
  },
});

Deno.test({
  name: "Warehouses - Delete | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.request(
      new Request(`http://127.0.0.1/warehouses/${ID}`, {
        method: "DELETE",
      }),
    );

    assert(response?.ok);
  },
});
