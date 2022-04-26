import { Application, assert, assertEquals } from "../../deps.ts";

import CartsRoutes from "./carts.ts";
import { Cart } from "../../utils/types.ts";
import Container from "../../services/mod.ts";

let ID = "";
let TOKEN = "";
const container = new Container();

Deno.test({
  name: "Carts - Create | ok",
  async fn() {
    const app = new Application();

    app.use(new CartsRoutes(container).routes());

    const data = JSON.stringify({
      products: {
        cart: [{
          pid: "f1d7548e-8d6d-4287-b446-29627e8a3442",
          quantity: 3,
        }],
      },
    });

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
    ID = carts.id;
  },
});

Deno.test({
  name: "Carts - Session | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(new CartsRoutes(container).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/carts/${ID}/init`, {
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        method: "POST",
      }),
    );

    assert(response?.ok);

    const body = await response?.json();
    TOKEN = body.token
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
