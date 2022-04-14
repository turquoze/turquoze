import { Application, assert, assertEquals } from "../../deps.ts";

import PricesRoutes from "./prices.ts";
import { Price } from "../../utils/types.ts";
import Container from "../../services/mod.ts";

let ID = "";
const container = new Container();

Deno.test({
  name: "Prices - Create | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(new PricesRoutes(container).routes());

    const data = JSON.stringify({
      amount: 100,
      product: "26b7157f-8c4b-4520-9e27-43500b668e8f",
    });

    const response = await app.handle(
      new Request(`http://127.0.0.1/prices`, {
        headers: new Headers({
          "Content-Type": "application/json",
          "Content-Length": `${JSON.stringify(data).length}`,
        }),
        method: "POST",
        body: data,
      }),
    );

    assert(response?.ok);

    const { prices }: { prices: Price } = await response?.json();
    ID = prices.id;
  },
});

Deno.test({
  name: "Prices - Get | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(new PricesRoutes(container).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/prices`, {
        method: "GET",
      }),
    );

    assert(response?.ok);
  },
});

Deno.test({
  name: "Prices - Get | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(new PricesRoutes(container).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/prices/${ID}`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { prices }: { prices: Price } = await response?.json();
    assertEquals(prices.id, ID);
  },
});

Deno.test({
  name: "Prices - Put | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(new PricesRoutes(container).routes());

    const data = JSON.stringify({
      amount: 200,
      product: "26b7157f-8c4b-4520-9e27-43500b668e8f",
    });

    const response = await app.handle(
      new Request(`http://127.0.0.1/prices/${ID}`, {
        headers: new Headers({
          "Content-Type": "application/json",
          "Content-Length": `${JSON.stringify(data).length}`,
        }),
        method: "PUT",
        body: data,
      }),
    );

    assert(response?.ok);

    const { prices }: { prices: Price } = await response?.json();
    assertEquals(prices.id, ID);
  },
});

Deno.test({
  name: "Prices - Delete | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(new PricesRoutes(container).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/prices/${ID}`, {
        method: "DELETE",
      }),
    );

    assert(response?.ok);
  },
});
