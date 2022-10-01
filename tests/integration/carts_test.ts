import {
  Application,
  assert,
  assertEquals,
  assertObjectMatch,
} from "../test_deps.ts";

import CartsRoutes from "../../src/routes/api/carts.ts";
import { Cart, CartItem } from "../../src/utils/types.ts";
import container from "../../src/services/mod.ts";
import { MEILIINDEX } from "../test_secrets.ts";

let ID = "";
const app = new Application();

app.use(async (ctx, next) => {
  ctx.state.shop = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
  ctx.state.request_data = {
    id: 0,
    public_id: "",
    regions: ["SE"],
    payment_id: "",
    currency: "SEK",
    name: "test",
    url: "https://example.com",
    search_index: MEILIINDEX!,
    secret: "test",
    _signKey: new Uint8Array(),
  };
  await next();
});

app.use(new CartsRoutes(container).routes());

Deno.test({
  name: "Carts - Create | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const data = JSON.stringify({});

    const response = await app.handle(
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
    ID = carts.public_id;
  },
});

Deno.test({
  name: "Carts - Get | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.handle(
      new Request(`http://127.0.0.1/carts/${ID}`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { carts }: { carts: Cart } = await response?.json();
    assertEquals(carts.public_id, ID);
  },
});

Deno.test({
  name: "Carts - Create Item | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const data = JSON.stringify({
      cart_id: ID,
      price: 2000,
      product_id: "00669ffc-bc13-47b1-aec6-f524611a657f",
      quantity: 2,
    });

    const response = await app.handle(
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
    const response = await app.handle(
      new Request(`http://127.0.0.1/carts/${ID}/items`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { carts }: { carts: Array<CartItem> } = await response?.json();

    assert(carts.length > 0);

    assertObjectMatch(carts[0], {
      id: carts[0].id,
      cart_id: ID,
      product_id: "00669ffc-bc13-47b1-aec6-f524611a657f",
      quantity: 2,
      price: 200000,
    });
  },
});

Deno.test({
  name: "Carts - Get Items | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.handle(
      new Request(
        `http://127.0.0.1/carts/${ID}/items/00669ffc-bc13-47b1-aec6-f524611a657f`,
        {
          method: "GET",
        },
      ),
    );

    assert(response?.ok);

    const { carts }: { carts: CartItem } = await response?.json();

    assertObjectMatch(carts, {
      id: carts.id,
      cart_id: ID,
      product_id: "00669ffc-bc13-47b1-aec6-f524611a657f",
      quantity: 2,
      price: 200000,
    });
  },
});

Deno.test({
  name: "Carts - Delete Items | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.handle(
      new Request(
        `http://127.0.0.1/carts/${ID}/items/00669ffc-bc13-47b1-aec6-f524611a657f`,
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
    const response = await app.handle(
      new Request(`http://127.0.0.1/carts/${ID}`, {
        method: "DELETE",
      }),
    );

    assert(response?.ok);
  },
});
