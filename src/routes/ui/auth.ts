import { Router } from "../../deps.ts";
import type Container from "../../services/mod.ts";
import { TurquozeState } from "../../utils/types.ts";
import { ErrorHandler } from "../../utils/errors.ts";
import { stringifyJSON } from "../../utils/utils.ts";

export default class AuthRoutes {
  #auth: Router<TurquozeState>;
  #Container: typeof Container;
  constructor(container: typeof Container) {
    this.#Container = container;
    this.#auth = new Router<TurquozeState>({
      prefix: "/auth",
    });

    this.#auth.post("/login", async (ctx) => {
      try {
        const form = await ctx.request.body({ type: "form" }).value;

        const email = form.get("email");
        const password = form.get("password");

        if (email != null && password != null) {
          const admin = await this.#Container.AdminService.Login({
            email,
            password,
          });

          //TODO: create a token

          /*const nextWeek = new Date();
          nextWeek.setDate(new Date().getDate() + 7);
          ctx.cookies.set("TurquozeAuth", admin.public_id, {
            expires: nextWeek,
          });*/

          ctx.response.body = stringifyJSON({
            token: `token-${admin.public_id}`,
          });
          ctx.response.headers.set("content-type", "application/json");
        } else {
          throw new Error("No username/passord")
        }
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.response.status = data.code;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify({
          message: data.message,
        });
      }
    });

    this.#auth.post("/logout", (ctx) => {
      ctx.cookies.delete("TurquozeAuth");

      ctx.response.redirect("/ui/auth/login");
    });
  }

  routes() {
    return this.#auth.routes();
  }
}
