import type { Context, Next } from "../deps.ts";

export default function Logger() {
  return async (ctx: Context, next: Next) => {
    await next();
    const rt = ctx.res.headers.get("X-Response-Time");
    console.log(
      `${ctx.req.method}|${ctx.res.status}|${
        new URL(ctx.req.raw.url).pathname
      }|${String(rt)}|${new Date().getTime()}|${Deno.env.get("DENO_REGION")}|${
        Deno.env.get("DENO_DEPLOYMENT_ID")
      }`,
    );
  };
}
