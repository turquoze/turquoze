import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.129.0/testing/asserts.ts";
import { Application } from "../../deps.ts";

import CartsRoutes from "./carts.ts";
import { Cart } from "../../utils/types.ts";
import Container from "../../services/mod.ts";

let ID = "";
const container = new Container();

Deno.test({
  name: "Carts - Create | ok",
  async fn() {
    const app = new Application();

    app.use(new CartsRoutes(container).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/carts`, {
        method: "POST",
      }),
    );

    assert(response?.ok);

    const { carts }: { carts: Cart } = await response?.json();
    ID = carts.id;
  },
});

Deno.test({
  name: "Carts - Get | ok",
  async fn() {
    const app = new Application();

    app.use(new CartsRoutes(container).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/carts/${ID}`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { carts }: { carts: Cart } = await response?.json();
    assertEquals(carts.id, ID);
  },
});

Deno.test({
  name: "Carts - Delete | ok",
  async fn() {
    const app = new Application();

    app.use(new CartsRoutes(container).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/carts/${ID}`, {
        method: "DELETE",
      }),
    );

    assert(response?.ok);
  },
});
