import { Application, assert, assertEquals } from "../test_deps.ts";

import PricesRoutes from "../../src/routes/api/prices.ts";
import { Price } from "../../src/utils/types.ts";
import container from "../../src/services/mod.ts";

let ID = "";
const app = new Application();

app.use(async (ctx, next) => {
  ctx.state.shop = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
  await next();
});

app.use(new PricesRoutes(container).routes());

Deno.test({
  name: "Prices - Create | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const data = JSON.stringify({
      amount: 100,
      product: "00669ffc-bc13-47b1-aec6-f524611a657f",
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
    ID = prices.public_id;
  },
});

Deno.test({
  name: "Prices - Get | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
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
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.handle(
      new Request(`http://127.0.0.1/prices/${ID}`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { prices }: { prices: Price } = await response?.json();
    assertEquals(prices.public_id, ID);
  },
});

Deno.test({
  name: "Prices - Put | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const data = JSON.stringify({
      amount: 200,
      product: "00669ffc-bc13-47b1-aec6-f524611a657f",
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
    assertEquals(prices.public_id, ID);
  },
});

Deno.test({
  name: "Prices - Delete | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.handle(
      new Request(`http://127.0.0.1/prices/${ID}`, {
        method: "DELETE",
      }),
    );

    assert(response?.ok);
  },
});
