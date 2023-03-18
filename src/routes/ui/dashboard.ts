import { jose, Router } from "../../deps.ts";
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
      } catch (error) {
        console.log(error);
        //TODO: error handling
        ctx.response.body = error;
      }
    });

    this.#dashboard.get("/:id", async (ctx, next) => {
      try {
        const shopLink = await this.#Container.ShopLinkService.GetShop({
          shopId: ctx.params.id,
          adminId: ctx.state.adminId!,
        });

        const data = await this.#Container.ShopService.Get({
          id: shopLink.shop,
        });

        const signKey = await jose.importJWK(
          JSON.parse(data.secret).pk,
          "PS256",
        );
        data._signKey = signKey;
        data._role = shopLink.role;
        container.Shop = data;

        await next();
      } catch (_error) {
        ctx.response.redirect("/ui/auth/login");
      }
    }, (ctx) => {
      const html = Render(shopPage);

      ctx.response.body = html;
    });
  }

  routes() {
    return this.#dashboard.routes();
  }
}
