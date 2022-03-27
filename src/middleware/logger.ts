import type { Context } from "../deps.ts";

export const Logger = async (
  ctx: Context,
  next: () => Promise<unknown>,
) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(
    `${ctx.request.method} ${ctx.request.url.pathname} - ${String(rt)} | ${
      new Date().getTime()
    }`,
  );
};

export default Logger;
