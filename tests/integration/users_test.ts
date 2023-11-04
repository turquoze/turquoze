import { assert, assertEquals } from "../test_deps.ts";

import UsersRoutes from "../../src/routes/admin/users.ts";
import { User } from "../../src/utils/types.ts";
import app from "../test_app.ts";

let ID = "";

app.use(new UsersRoutes(app.state.container).routes());

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
    ID = users.publicId;
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
    assertEquals(users.publicId, ID);
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
      publicId: "00000000-0000-0000-0000-000000000000",
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
    assertEquals(users.publicId, ID);
  },
});
