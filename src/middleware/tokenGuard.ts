import { jose } from "../deps.ts";
import { createMiddleware } from "@hono/hono/factory";

const TokenGuard = () =>
  createMiddleware(async (ctx, next) => {
    const authToken = ctx.req.header("Authorization");

    try {
      if (authToken != undefined && authToken != null) {
        const jwt = authToken.split(" ")[1];

        const SECRET_KEY = ctx.get("key_sign_key");
        const SHARED_SECRET_KEY = new TextEncoder().encode(SECRET_KEY);

        const result = await jose.jwtVerify(
          jwt,
          SHARED_SECRET_KEY,
        );

        const adminId = result.payload.adminId as string;

        ctx.set("adminId", adminId);
        await next();
      } else {
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          msg: "Not allowed",
          error: "NO_TOKEN",
        }, 401);
      }
    } catch (_error) {
      ctx.res.headers.set("content-type", "application/json");
      return ctx.json({
        msg: "Not allowed",
        error: "NO_PERMISSION",
      }, 403);
    }
  });

export default TokenGuard;
