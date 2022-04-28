import { Application, assert } from "../../deps.ts";

import UsersRoutes from "./users.ts";
import Container from "../../services/mod.ts";
//import { User } from "../../utils/types.ts";

const container = new Container();

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

    //const { users }: { users: User } = await response?.json();
  },
});
