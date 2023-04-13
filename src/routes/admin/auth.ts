import { jose, Router } from "../../deps.ts";
import type Container from "../../services/mod.ts";
import { TurquozeState } from "../../utils/types.ts";
import { ErrorHandler } from "../../utils/errors.ts";
import { stringifyJSON } from "../../utils/utils.ts";
import { SHARED_SECRET } from "../../utils/secrets.ts";
const SHARED_SECRET_KEY = new TextEncoder().encode(SHARED_SECRET);

export default class AuthRoutes {
  #auth: Router<TurquozeState>;
  #Container: typeof Container;
  constructor(container: typeof Container) {
    this.#Container = container;
    this.#auth = new Router<TurquozeState>({
      prefix: "/auth",
    });

    this.#auth.post("/login", async (ctx) => {
      try {
        const form = await ctx.request.body({ type: "form" }).value;

        const email = form.get("email");
        const password = form.get("password");

        if (email != null && password != null) {
          const admin = await this.#Container.AdminService.Login({
            email,
            password,
          });

          const shops = await this.#Container.ShopLinkService.GetShops({
            id: admin.public_id,
          });

          const KID = ctx.state.request_data.public_id;
          const iat = Math.floor(Date.now() / 1000);
          const exp = iat + 15 * 60;
          const claims = {
            iat,
            exp,
            shops,
            adminId: admin.public_id,
          };

          const iatRefresh = Math.floor(Date.now() / 1000);
          const expRefresh = iatRefresh + 60 * 60;
          const claimsRefresh = {
            iat: iatRefresh,
            exp: expRefresh,
            adminId: admin.public_id,
          };

          const jwt = await new jose.SignJWT(claims)
            .setProtectedHeader({ typ: "JWT", alg: "PS256", kid: KID })
            .sign(SHARED_SECRET_KEY);

          const refresh = await new jose.SignJWT(claimsRefresh)
            .setProtectedHeader({ typ: "JWT", alg: "PS256" })
            .sign(SHARED_SECRET_KEY);

          ctx.response.body = stringifyJSON({
            token: jwt,
            refreshToken: refresh,
            expire: exp,
          });
          ctx.response.headers.set("content-type", "application/json");
        } else {
          throw new Error("No username/passord");
        }
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.response.status = data.code;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify({
          message: data.message,
        });
      }
    });
  }

  routes() {
    return this.#auth.routes();
  }
}
