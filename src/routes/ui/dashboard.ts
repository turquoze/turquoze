import { Router } from "../../deps.ts";
import type Container from "../../services/mod.ts";
import { TurquozeState } from "../../utils/types.ts";
import dashboardPage from "../../pages/dashboard.tsx";
import shopPage from "../../pages/shop.tsx";
import Render from "../../utils/render.ts";
import CookieGuard from "../../middleware/cookieGuard.ts";
import ShopGuard from "../../middleware/shopGuard.ts";

export default class DashBoardRoutes {
  #dashboard: Router<TurquozeState>;
  #Container: typeof Container;
  constructor(container: typeof Container) {
    this.#Container = container;
    this.#dashboard = new Router<TurquozeState>({
      prefix: "/dashboard",
    });

    this.#dashboard.use(CookieGuard(container));

    this.#dashboard.get("/", async (ctx) => {
      try {
        const adminId = ctx.state.adminId!;

        const shops = await this.#Container.ShopLinkService.GetShops({
          id: adminId,
        });

        const shopLinks = shops.map((shop) => {
          return {
            id: shop.public_id,
            title: shop.name,
          };
        });

        const html = Render(() => dashboardPage(shopLinks));

        ctx.response.body = html;
      } catch (_error) {
        const html = Render(() => dashboardPage([]));

        ctx.response.status = 500;
        ctx.response.body = html;
      }
    });

    this.#dashboard.get("/:id", ShopGuard(container), (ctx) => {
      const html = Render(shopPage);

      ctx.response.body = html;
    });
  }

  routes() {
    return this.#dashboard.routes();
  }
}
