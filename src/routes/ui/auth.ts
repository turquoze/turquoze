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
      try {
        const form = await ctx.request.body({ type: "form" }).value;

        const email = form.get("email");
        const password = form.get("password");

        if (email != null && password != null) {
          const admin = await this.#Container.AdminService.Login({
            email,
            password,
          });

          const nextWeek = new Date();
          nextWeek.setDate(new Date().getDate() + 7);
          ctx.cookies.set("TurquozeAuth", admin.public_id, {
            expires: nextWeek,
          });

          ctx.response.redirect("/ui/dashboard");
        } else {
          const html = Render(loginPage(email));

          ctx.response.body = html;
        }
      } catch (_error) {
        const html = Render(loginPage);

        ctx.response.body = html;
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
