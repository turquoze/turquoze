import { Application, assert, assertEquals } from "../test_deps.ts";

import DiscountsRoutes from "../../src/routes/api/discounts.ts";
import { Discount } from "../../src/utils/types.ts";
import Container from "../../src/services/mod.ts";

let ID = "";
const container = new Container();

Deno.test({
  name: "Discounts - Create | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(new DiscountsRoutes(container).routes());

    const data = JSON.stringify({
      type: "FIXED",
      valid_from: null,
      valid_to: null,
      value: 20,
      code: "TEST",
    });

    const response = await app.handle(
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
    ID = discounts.id;
  },
});

Deno.test({
  name: "Discounts - Get Many | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(new DiscountsRoutes(container).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/discounts`, {
        method: "Get",
      }),
    );

    assert(response?.ok);
  },
});

Deno.test({
  name: "Discounts - Get | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(new DiscountsRoutes(container).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/discounts/${ID}`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { discounts }: { discounts: Discount } = await response?.json();
    assertEquals(discounts.id, ID);
  },
});

Deno.test({
  name: "Discounts - Delete | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(new DiscountsRoutes(container).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/discounts/${ID}`, {
        method: "DELETE",
      }),
    );

    assert(response?.ok);
  },
});
