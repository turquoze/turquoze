import { jose, RouterMiddleware } from "../deps.ts";
import { Container } from "../services/mod.ts";
import { TurquozeState } from "../utils/types.ts";

export const ShopGuard = (
  container: Container,
  // deno-lint-ignore no-explicit-any
): RouterMiddleware<any, { id: string }, TurquozeState> =>
  async function (ctx, next) {
    try {
      const shopLink = await container.ShopLinkService.GetShop({
        shopId: ctx.params.id,
        adminId: ctx.state.adminId!,
      });

      const data = await container.ShopService.Get({
        id: shopLink.shop,
      });

      const signKey = await jose.importJWK(
        JSON.parse(data.secret).pk,
        "PS256",
      );
      data._signKey = signKey;
      data._role = shopLink.role;
      container.Shop = data;

      await next();
    } catch (_error) {
      ctx.response.redirect("/ui/auth/login");
    }
  };

export default ShopGuard;
