import { Context, jose } from "../deps.ts";
import { SHARED_SECRET } from "../utils/secrets.ts";
import { TurquozeState } from "../utils/types.ts";
const SHARED_SECRET_KEY = new TextEncoder().encode(SHARED_SECRET);

export const TokenGuard =
  () => async (ctx: Context<TurquozeState>, next: () => Promise<unknown>) => {
    const authToken = ctx.request.headers.get("Authorization");

    try {
      if (authToken != undefined && authToken != null) {
        const jwt = authToken.split(" ")[1];

        const result = await jose.jwtVerify(
          jwt,
          SHARED_SECRET_KEY,
        );

        ctx.state.adminId = result.payload.adminId as string;
        await next();
      } else {
        ctx.response.status = 401;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify({
          msg: "Not allowed",
          error: "NO_TOKEN",
        });
      }
    } catch (_error) {
      ctx.response.status = 403;
      ctx.response.headers.set("content-type", "application/json");
      ctx.response.body = JSON.stringify({
        msg: "Not allowed",
        error: "NO_PERMISSION",
      });
    }
  };

export default TokenGuard;
