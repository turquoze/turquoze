import type { Context } from "../deps.ts";
import { Container } from "../services/mod.ts";
import { TurquozeState } from "../utils/types.ts";

export const AuthGuard =
  (container: Container) =>
  async (ctx: Context<TurquozeState>, next: () => Promise<unknown>) => {
    const tokenOld = ctx.request.headers.get("x-turquoze-key");

    const tokenId = ctx.request.headers.get("X-Turquoze-Id");
    const tokenSecret = ctx.request.headers.get("X-Turquoze-Secret");
    try {
      if (tokenOld != null) {
        const tokenInfo = await container.TokenService.GetOld({
          token: tokenOld,
        });

        if (tokenInfo.expire != null && tokenInfo.expire < Date.now()) {
          throw new Error("Not active");
        }

        ctx.state.shop = tokenInfo.shop;

        await next();
      } else if (tokenId != null && tokenSecret != null) {
        const tokenInfo = await container.TokenService.GetShopByToken({
          tokenId,
          tokenSecret,
        });

        ctx.state.request_data = tokenInfo;

        await next();
      } else {
        throw new Error("Not allowed");
      }
    } catch (error) {
      console.log(`token used: ${tokenOld}`);
      console.error(error);
      ctx.response.status = 401;
      ctx.response.headers.set("content-type", "application/json");
      ctx.response.body = JSON.stringify({
        msg: "Not allowed",
        error: "NO_TOKEN",
      });
    }
  };

export default AuthGuard;
