import { assert, assertEquals } from "../test_deps.ts";

import PricesRoutes from "../../src/routes/admin/prices.ts";
import app, { container } from "../test_app.ts";
import { Price } from "../../src/utils/validator.ts";
import { dbClient, PRODUCT_ID } from "../test_utils.ts";
import { prices } from "../../src/utils/schema.ts";
import { eq } from "../../src/deps.ts";

let ID = "";

app.route("/prices", new PricesRoutes(container).routes());

Deno.test({
  name: "Prices - Create | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const data = JSON.stringify({
      amount: 100,
      product: PRODUCT_ID,
    });

    const response = await app.request(
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
    ID = prices.publicId!;
  },
});

Deno.test({
  name: "Prices - Get | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.request(
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
    const response = await app.request(
      new Request(`http://127.0.0.1/prices/${ID}`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { prices }: { prices: Price } = await response?.json();
    assertEquals(prices.publicId, ID);
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
      product: PRODUCT_ID,
    });

    const response = await app.request(
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
    assertEquals(prices.publicId, ID);
  },
});

Deno.test({
  name: "Prices - Delete | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.request(
      new Request(`http://127.0.0.1/prices/${ID}`, {
        method: "DELETE",
      }),
    );

    assert(response?.ok);
    //@ts-expect-error not on type
    await dbClient.delete(prices).where(eq(prices.publicId, ID));
  },
});
