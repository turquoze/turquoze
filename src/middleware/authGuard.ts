import type { Context } from "../deps.ts";

export const AuthGuard = async (ctx: Context, next: () => Promise<unknown>) => {
  await new Promise((res, _rej) => {
    // validated
    res(true);
  });
  ctx.state = {
    user: {
      name: "test",
    },
    authd: true,
  };
  next();
  /*const key = ctx.request.headers.get("X-Turquoze-Auth-Key")
  if (key != null) {
    // validate jwt or check to DB
    await new Promise((res, _rej) => {
      // validated
      res(true)
    })
    next();
  } else {
    ctx.response.status = 403
    ctx.response.body = JSON.stringify({
      msg: "Not allowed, sign in",
      error: "NO_JWT"
    })
  }*/
};

export default AuthGuard;
