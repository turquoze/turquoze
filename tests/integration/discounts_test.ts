import { assert, assertEquals } from "../test_deps.ts";

import DiscountsRoutes from "../../src/routes/admin/discounts.ts";
import app, { container } from "../test_app.ts";
import { Discount } from "../../src/utils/validator.ts";
import { dbClient } from "../test_utils.ts";
import { discounts } from "../../src/utils/schema.ts";
import { eq } from "../../src/deps.ts";

let ID = "";

app.route("/discounts", new DiscountsRoutes(container).routes());

Deno.test({
  name: "Discounts - Create | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const data = JSON.stringify({
      type: "FIXED",
      valid_from: null,
      valid_to: null,
      value: 20,
      code: "TEST",
    });

    const response = await app.request(
      new Request(`http://127.0.0.1/discounts`, {
        headers: new Headers({
          "Content-Type": "application/json",
          "Content-Length": `${JSON.stringify(data).length}`,
        }),
        method: "POST",
        body: data,
      }),
    );

    assert(response?.ok);

    const { discounts }: { discounts: Discount } = await response?.json();
    ID = discounts.publicId!;
  },
});

Deno.test({
  name: "Discounts - Get Many | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.request(
      new Request(`http://127.0.0.1/discounts`, {
        method: "Get",
      }),
    );

    assert(response?.ok);
  },
});

Deno.test({
  name: "Discounts - Get | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.request(
      new Request(`http://127.0.0.1/discounts/${ID}`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { discounts }: { discounts: Discount } = await response?.json();
    assertEquals(discounts.publicId, ID);
  },
});

Deno.test({
  name: "Discounts - Delete | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.request(
      new Request(`http://127.0.0.1/discounts/${ID}`, {
        method: "DELETE",
      }),
    );

    assert(response?.ok);

    await dbClient.delete(discounts).where(eq(discounts.publicId, ID));
  },
});
