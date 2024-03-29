import type { Context, Next } from "../deps.ts";

export default function Cors() {
  return async (ctx: Context, next: Next) => {
    if (ctx.req.method == "OPTIONS") {
      ctx.res.headers.append("Access-Control-Allow-Origin", "*");
      ctx.res.headers.append(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS",
      );
      ctx.res.headers.append(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Turquoze-ShopId",
      );
      ctx.res.headers.append(
        "Access-Control-Allow-Credentials",
        true.valueOf().toString(),
      );

      return ctx.json({}, 200);
    } else {
      await next();
      ctx.res.headers.append("Access-Control-Allow-Origin", "*");
      ctx.res.headers.append(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS",
      );
      ctx.res.headers.append(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Turquoze-ShopId",
      );
      ctx.res.headers.append(
        "Access-Control-Allow-Credentials",
        true.valueOf().toString(),
      );
    }
  };
}
