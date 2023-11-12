import { Context } from "@oakserver/oak";
import Container from "../services/mod.ts";
import { TurquozeState } from "../utils/types.ts";
import { SHARED_SECRET } from "../utils/secrets.ts";
import * as jose from "jose";
import { Shop } from "../utils/schema.ts";
const SHARED_SECRET_KEY = new TextEncoder().encode(SHARED_SECRET);

export const CookieGuard =
  (container: Container) =>
  async (ctx: Context<TurquozeState>, next: () => Promise<unknown>) => {
    const pattern = new URLPattern({ pathname: "/admin/oauth/:id/*" });
    const match = pattern.exec(ctx.request.url.toString());
    const id = match?.pathname.groups.id;
    const url = ctx.request.url.pathname + ctx.request.url.search;

    try {
      const authCookie = await ctx.cookies.get("TurquozeAuth");
      if (authCookie != undefined && authCookie != null) {
        const jwt = authCookie;

        const result = await jose.jwtVerify(
          jwt,
          SHARED_SECRET_KEY,
        );

        const payload = result.payload;

        //@ts-ignore not on type
        ctx.state.adminId = payload.adminId!;

        ctx.state.request_data = await container.ShopService.Get({
          //@ts-ignore not on type
          id: payload.shopId,
        }) as unknown as Shop;

        await next();
      } else {
        ctx.response.redirect(
          `/admin/oauth/${id}/login?redirect=${url.toString()}`,
        );
      }
    } catch (_error) {
      ctx.response.status = 403;
      ctx.response.headers.set("content-type", "application/json");
      ctx.response.body = JSON.stringify({
        msg: "Not allowed",
        error: "NO_PERMISSION",
      });
    }
  };

export default CookieGuard;
