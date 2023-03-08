import { Context, jose } from "../deps.ts";
import { Container } from "../services/mod.ts";
import { TurquozeState } from "../utils/types.ts";

export const CookieGuard =
  (container: Container) =>
  async (ctx: Context<TurquozeState>, next: () => Promise<unknown>) => {
    const authCookie = await ctx.cookies.get("TurquozeAuth");

    try {
      if (authCookie != undefined && authCookie != null) {
        //TODO: get id from user

        const data = await container.ShopService.Get({
          id: "27dfd086-35d1-45f5-a921-b6866e5c24d8",
        });

        const signKey = await jose.importJWK(
          JSON.parse(data.secret).pk,
          "PS256",
        );
        data._signKey = signKey;
        data._role = "ADMIN"; //TODO: get from user
        container.Shop = data;

        ctx.state.request_data = data;
        await next();
      } else {
        throw new Error("Not allowed");
      }
    } catch (_error) {
      ctx.response.redirect("/ui/auth/login");
    }
  };

export default CookieGuard;
