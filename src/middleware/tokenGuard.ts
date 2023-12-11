import type { Context, Next } from "hono";
import { SHARED_SECRET } from "../utils/secrets.ts";
import * as jose from "jose";
const SHARED_SECRET_KEY = new TextEncoder().encode(SHARED_SECRET);

export default function TokenGuard() {
  return async (ctx: Context, next: Next) => {
    const authToken = ctx.req.header("Authorization");

    try {
      if (authToken != undefined && authToken != null) {
        const jwt = authToken.split(" ")[1];

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
  };
}
