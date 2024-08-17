import Container from "../services/mod.ts";
import { ShopLinkData, TurquozeRole } from "../utils/types.ts";
import { jose } from "../deps.ts";
import { DBShop, Shop } from "../utils/validator.ts";
import { Get } from "../utils/utils.ts";

import { createMiddleware } from "@hono/hono/factory";

const AuthGuard = (container: Container) =>
  createMiddleware(async (ctx, next) => {
    const tokenId = ctx.req.header("X-Turquoze-Id");
    const tokenSecret = ctx.req.header("X-Turquoze-Secret");

    const authToken = ctx.req.header("Authorization");
    const shopId = ctx.req.header("X-Turquoze-ShopId");
    try {
      if (tokenId != null && tokenSecret != null) {
        const msgUint8 = new TextEncoder().encode(tokenSecret);
        const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        const data = await Get<{ shop: DBShop; role: TurquozeRole }>(
          container,
          {
            id: `${tokenId}-${hashHex}-get-shop`,
            promise: container.TokenService.GetShopByToken({
              tokenId,
              tokenSecret,
            }),
          },
        );

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
        const SECRET_KEY = ctx.get("key_sign_key");
        const SHARED_SECRET_KEY = new TextEncoder().encode(SECRET_KEY);

        const result = await jose.jwtVerify(
          authToken.split(" ")[1],
          SHARED_SECRET_KEY,
        );

        const shops = JSON.parse(result.payload.shops as string) as Array<
          ShopLinkData
        >;

        //@ts-expect-error not on type
        const match = shops.find((x) => x.publicId == shopId);

        if (match == undefined) {
          throw new Error("No match found for shop");
        }

        const msgUint8 = new TextEncoder().encode(shopId);
        const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        const data = await Get<DBShop>(container, {
          id: `shop-by-id-${hashHex}`,
          promise: container.ShopService.Get({
            id: shopId,
          }),
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
  });

export default AuthGuard;
