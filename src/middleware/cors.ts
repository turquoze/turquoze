import { createMiddleware } from "@hono/hono/factory";

const Cors = () =>
  createMiddleware(async (ctx, next) => {
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
  });

export default Cors;
