import { Router } from "../../deps.ts";
import type Container from "../../services/mod.ts";
import { TurquozeState } from "../../utils/types.ts";
import dashboardPage from "../../pages/dashboard.tsx";
import shopPage from "../../pages/shop.tsx";
import Render from "../../utils/render.ts";
import CookieGuard from "../../middleware/cookieGuard.ts";

export default class DashBoardRoutes {
  #dashboard: Router<TurquozeState>;
  #Container: typeof Container;
  constructor(container: typeof Container) {
    this.#Container = container;
    this.#dashboard = new Router<TurquozeState>({
      prefix: "/dashboard",
    });

    this.#dashboard.use(CookieGuard(container));

    this.#dashboard.get("/", (ctx) => {
      const html = Render(dashboardPage);

      ctx.response.body = html;
    });

    this.#dashboard.get("/:id", (ctx) => {
      const html = Render(shopPage);

      ctx.response.body = html;
    });
  }

  routes() {
    return this.#dashboard.routes();
  }
}
