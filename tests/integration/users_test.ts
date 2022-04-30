import { Application, assert, assertEquals } from "../test_deps.ts";

import UsersRoutes from "../../src/routes/api/users.ts";
import container from "../../src/services/mod.ts";
import { User } from "../../src/utils/types.ts";

let ID = "";

Deno.test({
  name: "Users - Create | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(new UsersRoutes(container).routes());

    const data = JSON.stringify({
      system_id: "00000000-0000-0000-0000-000000000000",
      email: "test@example.com",
      name: "test",
      not_active: false,
    });

    const response = await app.handle(
      new Request(`http://127.0.0.1/users`, {
        headers: new Headers({
          "Content-Type": "application/json",
          "Content-Length": `${JSON.stringify(data).length}`,
        }),
        method: "POST",
        body: data,
      }),
    );

    assert(response?.ok);

    const { users }: { users: User } = await response?.json();
    ID = users.system_id;
  },
});

Deno.test({
  name: "Users - Get | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(new UsersRoutes(container).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/users`, {
        method: "GET",
      }),
    );

    assert(response?.ok);
  },
});

Deno.test({
  name: "Users - Get | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(new UsersRoutes(container).routes());

    const response = await app.handle(
      new Request(`http://127.0.0.1/users/${ID}`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { users }: { users: User } = await response?.json();
    assertEquals(users.system_id, ID);
  },
});

Deno.test({
  name: "Users - Put | ok",
  async fn() {
    const app = new Application();

    app.use(async (ctx, next) => {
      ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
      await next();
    });

    app.use(new UsersRoutes(container).routes());

    const data = JSON.stringify({
      id: "1",
      system_id: "00000000-0000-0000-0000-000000000000",
      email: "test@example.com",
      name: "test update",
      not_active: false,
    });

    const response = await app.handle(
      new Request(`http://127.0.0.1/users/${ID}`, {
        headers: new Headers({
          "Content-Type": "application/json",
          "Content-Length": `${JSON.stringify(data).length}`,
        }),
        method: "PUT",
        body: data,
      }),
    );

    assert(response?.ok);

    const { users }: { users: User } = await response?.json();
    assertEquals(users.system_id, ID);
  },
});
