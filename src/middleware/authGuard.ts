import { Context, jose } from "../deps.ts";
import { Container } from "../services/mod.ts";
import { TurquozeState } from "../utils/types.ts";

export const AuthGuard =
  (container: Container) =>
  async (ctx: Context<TurquozeState>, next: () => Promise<unknown>) => {
    const tokenId = ctx.request.headers.get("X-Turquoze-Id");
    const tokenSecret = ctx.request.headers.get("X-Turquoze-Secret");
    try {
      if (tokenId != null && tokenSecret != null) {
        const data = await container.TokenService.GetShopByToken({
          tokenId,
          tokenSecret,
        });

        const signKey = await jose.importJWK(
          JSON.parse(data.shop.secret).pk,
          "PS256",
        );
        data.shop._signKey = signKey;
        data.shop._role = data.role;
        container.Shop = data.shop;

        ctx.state.request_data = data.shop;
        await next();
      } else {
        throw new Error("Not allowed");
      }
    } catch (error) {
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
