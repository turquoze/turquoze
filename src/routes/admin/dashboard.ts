import type Container from "../../services/mod.ts";
import TokenGuard from "../../middleware/tokenGuard.ts";
import { Hono } from "../../deps.ts";

export default class DashBoardRoutes {
  #dashboard: Hono;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#dashboard = new Hono({ strict: false });

    this.#dashboard.use(TokenGuard());

    this.#dashboard.get("/", async (ctx) => {
      //@ts-expect-error not on type
      const adminId = ctx.get("adminId")!;

      const shops = await this.#Container.ShopLinkService.GetShops({
        //@ts-expect-error not on type
        id: adminId,
      });

      const shopLinks = shops.map((shop) => {
        return {
          //@ts-expect-error not on type
          id: shop.publicId,
          //@ts-expect-error not on type
          title: shop.name,
        };
      });

      ctx.res.headers.set("content-type", "application/json");
      return ctx.json({
        shops: shopLinks,
      });
    });
  }

  routes() {
    return this.#dashboard;
  }
}
