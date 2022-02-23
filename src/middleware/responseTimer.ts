import type { Context } from "../deps.ts";

export const ResponseTimer = async (
  ctx: Context,
  next: () => Promise<unknown>,
) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
};

export default ResponseTimer;
