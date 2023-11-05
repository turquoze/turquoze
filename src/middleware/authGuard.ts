import { Context } from "@oakserver/oak";
import Container from "../services/mod.ts";
import { SHARED_SECRET } from "../utils/secrets.ts";
import { Shop, ShopLinkData, TurquozeState } from "../utils/types.ts";
import * as jose from "jose";
const SHARED_SECRET_KEY = new TextEncoder().encode(SHARED_SECRET);

export const AuthGuard =
  (container: Container) =>
  async (ctx: Context<TurquozeState>, next: () => Promise<unknown>) => {
    const tokenId = ctx.request.headers.get("X-Turquoze-Id");
    const tokenSecret = ctx.request.headers.get("X-Turquoze-Secret");

    const authToken = ctx.request.headers.get("Authorization");
    const shopId = ctx.request.headers.get("X-Turquoze-ShopId");
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
      } else if (authToken != null && shopId != null) {
        const result = await jose.jwtVerify(
          authToken.split(" ")[1],
          SHARED_SECRET_KEY,
        );

        const shops = JSON.parse(result.payload.shops as string) as Array<
          ShopLinkData
        >;

        const match = shops.find((x) => x.publicId == shopId);

        if (match == undefined) {
          throw new Error("No match found for shop");
        }

        const data = await container.ShopService.Get({
          id: shopId,
        });

        const signKey = await jose.importJWK(
          JSON.parse(data.secret).pk,
          "PS256",
        );

        const shop: Shop = {
          _role: match.role,
          _signKey: signKey,
          currency: data.currency,
          id: data.id,
          name: data.name,
          publicId: data.publicId,
          regions: data.regions,
          search_index: data.search_index,
          secret: data.secret,
          settings: data.settings,
          url: data.url,
          paymentId: data.paymentId,
          shippingId: data.shippingId,
        };

        container.Shop = shop;
        ctx.state.request_data = shop;
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
