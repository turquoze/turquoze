import type { Context } from "@oakserver/oak";

export const Logger = async (
  ctx: Context,
  next: () => Promise<unknown>,
) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(
    `${ctx.request.method}|${ctx.response.status}|${ctx.request.url.toString()}|${
      String(rt)
    }|${new Date().getTime()}|${Deno.env.get("DENO_REGION")}|${
      Deno.env.get("DENO_DEPLOYMENT_ID")
    }`,
  );
};

export default Logger;
