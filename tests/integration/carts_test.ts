import { assert, assertEquals, assertObjectMatch } from "../test_deps.ts";

import CartsRoutes from "../../src/routes/api/carts.ts";
import app, { container } from "../test_app.ts";
import { Cart, CartItem } from "../../src/utils/validator.ts";
import { PRODUCT_ID } from "../test_utils.ts";

let ID = "";

app.route("/carts", new CartsRoutes(container).routes());

Deno.test({
  name: "Carts - Create | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const data = JSON.stringify({});

    const response = await app.request(
      new Request(`http://127.0.0.1/carts`, {
        headers: new Headers({
          "Content-Type": "application/json",
          "Content-Length": `${JSON.stringify(data).length}`,
        }),
        method: "POST",
        body: data,
      }),
    );

    assert(response?.ok);

    const { carts }: { carts: Cart } = await response?.json();
    ID = carts.publicId!;
  },
});

Deno.test({
  name: "Carts - Get | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.request(
      new Request(`http://127.0.0.1/carts/${ID}`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { carts }: { carts: Cart } = await response?.json();
    assertEquals(carts.publicId, ID);
  },
});

Deno.test({
  name: "Carts - Create Item | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const data = JSON.stringify({
      cartId: ID,
      price: 2000,
      itemId: PRODUCT_ID,
      quantity: 2,
    });

    const response = await app.request(
      new Request(`http://127.0.0.1/carts/${ID}/items`, {
        headers: new Headers({
          "Content-Type": "application/json",
          "Content-Length": `${JSON.stringify(data).length}`,
        }),
        method: "POST",
        body: data,
      }),
    );

    assert(response?.ok);
  },
});

Deno.test({
  name: "Carts - Get Items | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.request(
      new Request(`http://127.0.0.1/carts/${ID}/items`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { carts }: { carts: Array<CartItem> } = await response?.json();

    assert(carts.length > 0);

    assertObjectMatch(carts[0], {
      id: carts[0].id,
      cartId: ID,
      itemId: PRODUCT_ID,
      quantity: 2,
      price: 28390,
    });
  },
});

Deno.test({
  name: "Carts - Get Items | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.request(
      new Request(
        `http://127.0.0.1/carts/${ID}/items/${PRODUCT_ID}`,
        {
          method: "GET",
        },
      ),
    );

    assert(response?.ok);

    const { carts }: { carts: CartItem } = await response?.json();

    assertObjectMatch(carts, {
      id: carts.id,
      cartId: ID,
      itemId: PRODUCT_ID,
      quantity: 2,
      price: 28390,
    });
  },
});

Deno.test({
  name: "Carts - Delete Items | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.request(
      new Request(
        `http://127.0.0.1/carts/${ID}/items/${PRODUCT_ID}`,
        {
          method: "DELETE",
        },
      ),
    );

    assert(response?.ok);
  },
});

Deno.test({
  name: "Carts - Delete | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.request(
      new Request(`http://127.0.0.1/carts/${ID}`, {
        method: "DELETE",
      }),
    );

    assert(response?.ok);
  },
});
