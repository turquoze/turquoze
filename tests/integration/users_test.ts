import { Application, assert, assertEquals } from "../test_deps.ts";

import UsersRoutes from "../../src/routes/api/users.ts";
import container from "../../src/services/mod.ts";
import { User } from "../../src/utils/types.ts";

let ID = "";
const app = new Application();

app.use(async (ctx, next) => {
  ctx.state.shop = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
  ctx.state.request_data = {
    id: 0,
    public_id: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
    regions: ["SE"],
    payment_id: "",
    currency: "SEK",
    name: "test",
    url: "https://example.com",
    search_index: "",
    secret: "test",
    _signKey: new Uint8Array(),
  };
  await next();
});

app.use(new UsersRoutes(container).routes());

Deno.test({
  name: "Users - Create | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const data = {
      password: "test123",
      email: "test@example.com",
      name: "test",
      not_active: false,
    };

    const response = await app.handle(
      new Request(`http://127.0.0.1/users`, {
        headers: new Headers({
          "Content-Type": "application/json",
          "Content-Length": `${JSON.stringify(data).length}`,
        }),
        method: "POST",
        body: JSON.stringify(data),
      }),
    );

    assert(response?.ok);

    const { users }: { users: User } = await response?.json();
    ID = users.public_id;
  },
});

Deno.test({
  name: "Users - Get | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
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
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const response = await app.handle(
      new Request(`http://127.0.0.1/users/${ID}`, {
        method: "GET",
      }),
    );

    assert(response?.ok);

    const { users }: { users: User } = await response?.json();
    assertEquals(users.public_id, ID);
  },
});

Deno.test({
  name: "Users - Put | ok",
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
  async fn() {
    const data = JSON.stringify({
      id: 1,
      public_id: "00000000-0000-0000-0000-000000000000",
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
    assertEquals(users.public_id, ID);
  },
});
