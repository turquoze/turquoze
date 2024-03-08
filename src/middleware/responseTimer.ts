import type { Context, Next } from "../deps.ts";

export default function ResponseTimer() {
  return async (ctx: Context, next: Next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.res.headers.set("X-Response-Time", `${ms}ms`);
  };
}
