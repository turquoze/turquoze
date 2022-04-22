import type { Context } from "../deps.ts";
import { TOKEN } from "../utils/secrets.ts";

export const AuthGuard = async (ctx: Context, next: () => Promise<unknown>) => {
  try {
    const key = ctx.request.headers.get("x-turquoze-key");
    if (key != null && key == TOKEN) {
      await next();
    } else {
      throw new Error("Not allowed");
    }
  } catch (_error) {
    ctx.response.status = 401;
    ctx.response.headers.set("content-type", "application/json");
    ctx.response.body = JSON.stringify({
      msg: "Not allowed",
      error: "NO_TOKEN",
    });
  }
};

export default AuthGuard;
