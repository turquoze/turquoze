import type { Context, Next } from "../deps.ts";
import Container from "../services/mod.ts";
import { getCookie, jose } from "../deps.ts";
import { Shop } from "../utils/validator.ts";

export default function CookieGuard(container: Container) {
  return async (ctx: Context, next: Next) => {
    const pattern = new URLPattern({ pathname: "/admin/oauth/:id/*" });
    const match = pattern.exec(ctx.req.url.toString());
    const id = match?.pathname.groups.id;
    const url = ctx.req.raw.url + ctx.req.url.search;

    try {
      const authCookie = getCookie(ctx, "TurquozeAuth");
      if (authCookie != undefined && authCookie != null) {
        const jwt = authCookie;

        const SECRET_KEY = ctx.get("key_sign_key");
        const SHARED_SECRET_KEY = new TextEncoder().encode(SECRET_KEY);

        const result = await jose.jwtVerify(
          jwt,
          SHARED_SECRET_KEY,
        );

        const payload = result.payload;

        //@ts-ignore not on type
        ctx.state.adminId = payload.adminId!;

        const data = await container.ShopService.Get({
          //@ts-ignore not on type
          id: payload.shopId,
        }) as unknown as Shop;

        ctx.set("request_data", data);

        await next();
      } else {
        return ctx.redirect(
          `/admin/oauth/${id}/login?redirect=${url.toString()}`,
        );
      }
    } catch (_error) {
      ctx.res.headers.set("content-type", "application/json");
      return ctx.json({
        msg: "Not allowed",
        error: "NO_PERMISSION",
      }, 403);
    }
  };
}
