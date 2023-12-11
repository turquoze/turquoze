import type { Context, Next } from "hono";

export default function ResponseTimer() {
  return async (ctx: Context, next: Next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.res.headers.set("X-Response-Time", `${ms}ms`);
  };
}
