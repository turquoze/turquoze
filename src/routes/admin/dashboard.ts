import { Hono } from "hono";
import type Container from "../../services/mod.ts";
import { ErrorHandler } from "../../utils/errors.ts";
import TokenGuard from "../../middleware/tokenGuard.ts";

export default class DashBoardRoutes {
  #dashboard: Hono;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#dashboard = new Hono();

    this.#dashboard.use(TokenGuard());

    this.#dashboard.get("/", async (ctx) => {
      try {
        //@ts-expect-error not on type
        const adminId = ctx.get("adminId")!;

        const shops = await this.#Container.ShopLinkService.GetShops({
          id: adminId,
        });

        const shopLinks = shops.map((shop) => {
          return {
            id: shop.publicId,
            title: shop.name,
          };
        });

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          shops: shopLinks,
        });
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });
  }

  routes() {
    return this.#dashboard;
  }
}
