import { Application, assert, assertEquals } from "../test_deps.ts";

import ShopsRoutes from "../../src/routes/api/shops.ts";
import container from "../../src/services/mod.ts";
import { Shop } from "../../src/utils/types.ts";

let ID = "";

Deno.test({
  name: "Shops - Create | ok",
  async fn() {
    const app = new Application();

    app.use(new ShopsRoutes(container).routes());

    const data = JSON.stringify({
      currency: "EUR",
      name: "TEST-REGION",
      regions: ["EU"],
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
    ID = regions.public_id;
  },
});

Deno.test({
  name: "Shops - Get | ok",
  async fn() {
    const app = new Application();

    app.use(new ShopsRoutes(container).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/shops/${ID}`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { regions }: { regions: Shop } = await response?.json();
    assertEquals(regions.public_id, ID);
  },
});

Deno.test({
  name: "Shops - Put | ok",
  async fn() {
    const app = new Application();

    app.use(new ShopsRoutes(container).routes());

    const data = JSON.stringify({
      id: ID,
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
    assertEquals(regions.public_id, ID);
  },
});

Deno.test({
  name: "Shops - Delete | ok",
  async fn() {
    const app = new Application();

    app.use(new ShopsRoutes(container).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/shops/${ID}`, {
        method: "DELETE",
      }),
    );

    assert(response?.ok);
  },
});