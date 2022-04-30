import type { Context } from "../deps.ts";
import IRegionService from "../services/interfaces/regionService.ts";
import { TurquozeState } from "../utils/types.ts";

export const ApplicationState = (regionService: IRegionService) =>
  async (
    ctx: Context<TurquozeState>,
    next: () => Promise<unknown>,
  ) => {
    try {
      if (
        ctx.state.region == undefined || ctx.state.region == null ||
        ctx.state.region == ""
      ) {
        throw new Error("Something is wrong");
      }
      const region = await regionService.Get({ id: ctx.state.region });
      console.log(region.name);
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
