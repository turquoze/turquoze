import { jose, RouterContext } from "../deps.ts";
import { Container } from "../services/mod.ts";
import { TurquozeState } from "../utils/types.ts";

export const ShopGuard = (container: Container) =>
async (
  ctx: RouterContext<"/:id", { id: string }, TurquozeState>,
  next: () => Promise<unknown>,
) => {
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

    console.log("shop guard");

    await next();
  } catch (_error) {
    ctx.response.redirect("/ui/auth/login");
  }
};

export default ShopGuard;
