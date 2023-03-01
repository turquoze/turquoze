import { Router } from "../../deps.ts";
import type Container from "../../services/mod.ts";
import { TurquozeState } from "../../utils/types.ts";
import loginPage from "../../pages/login.tsx";
import Render from "../../utils/render.ts";

export default class AuthRoutes {
  #auth: Router<TurquozeState>;
  #Container: typeof Container;
  constructor(container: typeof Container) {
    this.#Container = container;
    this.#auth = new Router<TurquozeState>({
      prefix: "/auth",
    });

    this.#auth.get("/login", (ctx) => {
      const html = Render(loginPage);

      ctx.response.body = html;
    });

    this.#auth.post("/login", async (ctx) => {
      const form = await ctx.request.body({ type: "form" }).value;

      const email = form.get("email");
      const password = form.get("password");

      if (email != null && password != null) {
        ctx.response.redirect("/ui/dashboard");
      } else {
        const html = Render(loginPage(email));

        ctx.response.body = html;
      }
    });
  }

  routes() {
    return this.#auth.routes();
  }
}
