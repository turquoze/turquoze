import { Application, assert, assertEquals } from "../test_deps.ts";

import RegionsRoutes from "../../src/routes/api/regions.ts";
import container from "../../src/services/mod.ts";
import { Region } from "../../src/utils/types.ts";

let ID = "";

Deno.test({
  name: "Regions - Create | ok",
  async fn() {
    const app = new Application();

    app.use(new RegionsRoutes(container).routes());

    const data = JSON.stringify({
      currency: "EUR",
      name: "TEST-REGION",
      regions: ["EU"],
    });

    const response = await app.handle(
      new Request(`http://127.0.0.1/regions`, {
        headers: new Headers({
          "Content-Type": "application/json",
          "Content-Length": `${JSON.stringify(data).length}`,
        }),
        method: "POST",
        body: data,
      }),
    );

    assert(response?.ok);

    const { regions }: { regions: Region } = await response?.json();
    ID = regions.id;
  },
});

Deno.test({
  name: "Regions - Get | ok",
  async fn() {
    const app = new Application();

    app.use(new RegionsRoutes(container).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/regions/${ID}`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { regions }: { regions: Region } = await response?.json();
    assertEquals(regions.id, ID);
  },
});

Deno.test({
  name: "Regions - Put | ok",
  async fn() {
    const app = new Application();

    app.use(new RegionsRoutes(container).routes());

    const data = JSON.stringify({
      id: ID,
      name: "TEST-UPDATE",
      currency: "USD",
      regions: ["EU", "GB"],
    });

    const response = await app.handle(
      new Request(`http://127.0.0.1/regions/${ID}`, {
        headers: new Headers({
          "Content-Type": "application/json",
          "Content-Length": `${JSON.stringify(data).length}`,
        }),
        method: "PUT",
        body: data,
      }),
    );

    assert(response?.ok);

    const { regions }: { regions: Region } = await response?.json();
    assertEquals(regions.id, ID);
  },
});

Deno.test({
  name: "Regions - Delete | ok",
  async fn() {
    const app = new Application();

    app.use(new RegionsRoutes(container).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/regions/${ID}`, {
        method: "DELETE",
      }),
    );

    assert(response?.ok);
  },
});
