import { assert, assertEquals } from "../test_deps.ts";

import ShopsRoutes from "../../src/routes/admin/shops.ts";
import { Shop } from "../../src/utils/types.ts";
import app from "../test_app.ts";

let ID = "";

app.use(new ShopsRoutes(app.state.container).routes());

Deno.test({
  name: "Shops - Create | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const data = JSON.stringify({
      currency: "EUR",
      name: "TEST-REGION",
      regions: ["EU"],
      meilisearch: {
        api_key: "",
        host: "",
        index: "",
      },
    });

    const response = await app.handle(
      new Request(`http://127.0.0.1/shops`, {
        headers: new Headers({
          "Content-Type": "application/json",
          "Content-Length": `${JSON.stringify(data).length}`,
        }),
        method: "POST",
        body: data,
      }),
    );

    assert(response?.ok);

    const { regions }: { regions: Shop } = await response?.json();
    ID = regions.publicId;
  },
});

Deno.test({
  name: "Shops - Get | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.handle(
      new Request(`http://127.0.0.1/shops/${ID}`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { regions }: { regions: Shop } = await response?.json();
    assertEquals(regions.publicId, ID);
  },
});

Deno.test({
  name: "Shops - Put | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const data = JSON.stringify({
      publicId: ID,
      name: "TEST-UPDATE",
      currency: "USD",
      regions: ["EU", "GB"],
    });

    const response = await app.handle(
      new Request(`http://127.0.0.1/shops/${ID}`, {
        headers: new Headers({
          "Content-Type": "application/json",
          "Content-Length": `${JSON.stringify(data).length}`,
        }),
        method: "PUT",
        body: data,
      }),
    );

    assert(response?.ok);

    const { regions }: { regions: Shop } = await response?.json();
    assertEquals(regions.publicId, ID);
  },
});

Deno.test({
  name: "Shops - Delete | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.handle(
      new Request(`http://127.0.0.1/shops/${ID}`, {
        method: "DELETE",
      }),
    );

    assert(response?.ok);
  },
});
