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
    this.#auth = new Router<TurquozeState>();

    this.#auth.get("/login", (ctx) => {
      const html = Render(loginPage);

      ctx.response.body = html;
    });

    this.#auth.post("/login", (ctx) => {
      const html = Render(loginPage("test@example.com"));

      ctx.response.body = html;
    });
  }

  routes() {
    return this.#auth.routes();
  }
}
