import { createMiddleware } from "@hono/hono/factory";

const ResponseTimer = () =>
  createMiddleware(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.res.headers.set("X-Response-Time", `${ms}ms`);
  });

export default ResponseTimer;
