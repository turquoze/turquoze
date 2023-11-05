import { Router } from "@oakserver/oak";
import type Container from "../../services/mod.ts";
import { TurquozeState } from "../../utils/types.ts";
import { stringifyJSON } from "../../utils/utils.ts";
import { ErrorHandler } from "../../utils/errors.ts";
import TokenGuard from "../../middleware/tokenGuard.ts";

export default class DashBoardRoutes {
  #dashboard: Router<TurquozeState>;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#dashboard = new Router<TurquozeState>({
      prefix: "/dashboard",
    });

    this.#dashboard.use(TokenGuard());

    this.#dashboard.get("/", async (ctx) => {
      try {
        const adminId = ctx.state.adminId!;

        const shops = await this.#Container.ShopLinkService.GetShops({
          id: adminId,
        });

        const shopLinks = shops.map((shop) => {
          return {
            id: shop.publicId,
            title: shop.name,
          };
        });

        ctx.response.body = stringifyJSON({
          shops: shopLinks,
        });
        ctx.response.headers.set("content-type", "application/json");
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.response.status = data.code;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify({
          message: data.message,
        });
      }
    });
  }

  routes() {
    return this.#dashboard.routes();
  }
}
