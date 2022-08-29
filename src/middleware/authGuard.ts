import type { Context } from "../deps.ts";
import ITokenService from "../services/interfaces/tokenService.ts";

export const AuthGuard =
  (tokenService: ITokenService) =>
  async (ctx: Context, next: () => Promise<unknown>) => {
    const token = ctx.request.headers.get("x-turquoze-key");
    try {
      if (token != null) {
        const tokenInfo = await tokenService.Get({ token });

        if (tokenInfo.expire != null && tokenInfo.expire < Date.now()) {
          throw new Error("Not active");
        }

        ctx.state.shop = tokenInfo.shop;

        await next();
      } else {
        throw new Error("Not allowed");
      }
    } catch (error) {
      console.log(`token used: ${token}`);
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
