import type { Context } from "../deps.ts";
import IShopService from "../services/interfaces/shopService.ts";
import { TurquozeState } from "../utils/types.ts";

export const ApplicationState = (shopService: IShopService) =>
  async (
    ctx: Context<TurquozeState>,
    next: () => Promise<unknown>,
  ) => {
    try {
      if (
        ctx.state.shop == undefined || ctx.state.shop == null ||
        ctx.state.shop == ""
      ) {
        throw new Error("Something is wrong");
      }
      const shop = await shopService.Get({ id: ctx.state.shop });

      ctx.state.request_data = shop;

      await next();
    } catch (_error) {
      ctx.response.status = 401;
      ctx.response.headers.set("content-type", "application/json");
      ctx.response.body = JSON.stringify({
        msg: "Not allowed",
        error: "NO_TOKEN",
      });
    }
  };

export default ApplicationState;
