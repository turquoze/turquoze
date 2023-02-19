import { Context, jose } from "../deps.ts";
import { Container } from "../services/mod.ts";
import { TurquozeState } from "../utils/types.ts";

export const CookieGuard =
  (container: Container) =>
  async (ctx: Context<TurquozeState>, next: () => Promise<unknown>) => {
    const authCookie = await ctx.cookies.get("Turquoze");

    try {
      if (authCookie != undefined && authCookie != null) {
        //TODO: change to decrypt the cookie content
        const tokenId = authCookie.split(":")[0];
        const tokenSecret = authCookie.split(":")[1];

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

export default CookieGuard;
