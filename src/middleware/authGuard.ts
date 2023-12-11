import type { Context, Next } from "hono";
import Container from "../services/mod.ts";
import { SHARED_SECRET } from "../utils/secrets.ts";
import { ShopLinkData } from "../utils/types.ts";
import * as jose from "jose";
import { Shop } from "../utils/schema.ts";
const SHARED_SECRET_KEY = new TextEncoder().encode(SHARED_SECRET);

export default function AuthGuard(container: Container) {
  return async (ctx: Context, next: Next) => {
    const tokenId = ctx.req.headers.get("X-Turquoze-Id");
    const tokenSecret = ctx.req.header("X-Turquoze-Secret");

    const authToken = ctx.req.header("Authorization");
    const shopId = ctx.req.header("X-Turquoze-ShopId");
    try {
      if (tokenId != null && tokenSecret != null) {
        const data = await container.TokenService.GetShopByToken({
          tokenId,
          tokenSecret,
        });

        const shop = data.shop as Shop;

        const signKey = await jose.importJWK(
          JSON.parse(shop.secret!).pk,
          "PS256",
        );

        shop._signKey = signKey;
        shop._role = data.role;
        container.Shop = shop;

        ctx.set("request_data", shop);
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
          JSON.parse(data.secret!).pk,
          "PS256",
        );

        const shop: Shop = {
          _role: match.role,
          _signKey: signKey,
          currency: data.currency!,
          id: data.id,
          name: data.name,
          publicId: data.publicId,
          regions: data.regions,
          searchIndex: data.searchIndex,
          secret: data.secret,
          settings: data.settings,
          url: data.url,
          paymentId: data.paymentId,
          shippingId: data.shippingId,
        };

        container.Shop = shop;
        ctx.set("request_data", shop);
        await next();
      } else {
        throw new Error("Not allowed");
      }
    } catch (error) {
      console.error(error);
      ctx.res.headers.set("content-type", "application/json");
      return ctx.json({
        msg: "Not allowed",
        error: "NO_TOKEN",
      }, 401);
    }
  };
}
