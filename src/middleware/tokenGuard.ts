import { Context, jose } from "../deps.ts";
import { TurquozeState } from "../utils/types.ts";

export const TokenGuard =
  () => async (ctx: Context<TurquozeState>, next: () => Promise<unknown>) => {
    const authToken = ctx.request.headers.get("Authorization");

    try {
      if (authToken != undefined && authToken != null) {
        const jwt = authToken.split(" ")[1];

        const result = await jose.jwtVerify(
          jwt,
          ctx.state.request_data._signKey,
        );

        ctx.state.adminId = result.payload.adminId as string;
        await next();
      } else {
        throw new Error("Not allowed");
      }
    } catch (_error) {
      ctx.response.status = 401;
      ctx.response.headers.set("content-type", "application/json");
      ctx.response.body = JSON.stringify({
        msg: "Not allowed",
        error: "NO_TOKEN",
      });
    }
  };

export default TokenGuard;
