import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.129.0/testing/asserts.ts";
import { Application } from "../../deps.ts";

import RegionsRoutes from "./regions.ts";
import { RegionService } from "../../services/mod.ts";
import { Region } from "../../utils/types.ts";

let ID = "";

Deno.test({
  name: "Regions - Create | ok",
  async fn() {
    const app = new Application();

    app.use(new RegionsRoutes(RegionService).routes());

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

    app.use(new RegionsRoutes(RegionService).routes());

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

    app.use(new RegionsRoutes(RegionService).routes());

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

    app.use(new RegionsRoutes(RegionService).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/regions/${ID}`, {
        method: "DELETE",
      }),
    );

    assert(response?.ok);
  },
});
