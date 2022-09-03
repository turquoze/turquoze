import type { Context } from "../deps.ts";
import { Container } from "../services/mod.ts";
import { TurquozeState } from "../utils/types.ts";

export const ApplicationState = (container: Container) =>
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
    const shop = await container.ShopService.Get({ id: ctx.state.shop });

    container.Shop = shop;

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
