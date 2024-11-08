import { createMiddleware, log } from "../deps.ts";

const Logger = () =>
  createMiddleware(async (ctx, next) => {
    await next();
    const rt = ctx.res.headers.get("X-Response-Time");
    log.info(
      `${ctx.req.method}|${ctx.res.status}|${
        new URL(ctx.req.raw.url).pathname
      }|${String(rt)}|${new Date().getTime()}|${Deno.env.get("DENO_REGION")}|${
        Deno.env.get("DENO_DEPLOYMENT_ID")
      }`,
    );
  });

export default Logger;
