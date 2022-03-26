import { Application, assert, assertEquals } from "../../deps.ts";

import RegionsRoutes from "./regions.ts";
import Container from "../../services/mod.ts";
import { Region } from "../../utils/types.ts";

let ID = "";
const container = new Container();

Deno.test({
  name: "Regions - Create | ok",
  async fn() {
    const app = new Application();

    app.use(new RegionsRoutes(container).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/regions`, {
        method: "POST",
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

    const response = await app.handle(
      new Request(`http://127.0.0.1/regions/${ID}`, {
        method: "PUT",
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
