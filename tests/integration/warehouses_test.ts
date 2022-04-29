import { Application, assert, assertEquals } from "../test_deps.ts";

import WarehousesRoutes from "../../src/routes/api/warehouses.ts";
import { Warehouse } from "../../src/utils/types.ts";
import Container from "../../src/services/mod.ts";

let ID = "";
const container = new Container();

Deno.test({
  name: "Warehouses - Create | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(new WarehousesRoutes(container).routes());

    const data = JSON.stringify({
      address: "Test 1B",
      country: "Sweden",
      name: "Sweden A",
    });

    const response = await app.handle(
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
    ID = warehouses.id;
  },
});

Deno.test({
  name: "Warehouses - Get | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(new WarehousesRoutes(container).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/warehouses`, {
        method: "GET",
      }),
    );

    assert(response?.ok);
  },
});

Deno.test({
  name: "Warehouses - Get | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(new WarehousesRoutes(container).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/warehouses/${ID}`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { warehouses }: { warehouses: Warehouse } = await response?.json();
    assertEquals(warehouses.id, ID);
  },
});

Deno.test({
  name: "Warehouses - Put | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(new WarehousesRoutes(container).routes());

    const data = JSON.stringify({
      address: "Test 1B - Update",
      country: "Sweden - Update",
      name: "Sweden A - Update",
    });

    const response = await app.handle(
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
    assertEquals(warehouses.id, ID);
  },
});

Deno.test({
  name: "Warehouses - Delete | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(new WarehousesRoutes(container).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/warehouses/${ID}`, {
        method: "DELETE",
      }),
    );

    assert(response?.ok);
  },
});
