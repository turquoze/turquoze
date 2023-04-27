import { jose, Router } from "../../deps.ts";
import type Container from "../../services/mod.ts";
import { TurquozeState } from "../../utils/types.ts";
import { ErrorHandler } from "../../utils/errors.ts";
import { stringifyJSON } from "../../utils/utils.ts";
import CookieGuard from "../../middleware/cookieGuard.ts";
import { SHARED_SECRET } from "../../utils/secrets.ts";
const SHARED_SECRET_KEY = new TextEncoder().encode(SHARED_SECRET);

export default class OAuthRoutes {
  #oauth: Router<TurquozeState>;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#oauth = new Router<TurquozeState>({
      prefix: "/oauth",
    });

    this.#oauth.get("/:id/login", (ctx) => {
      try {
        ctx.response.body = `<html><head></head><body><div>
          <form method="POST">
            <input type="hidden" name="redirect" value="${ctx.request.url.search}">
            <input type="email" name="email">
            <input type="password" name="password">
            <input type="submit" value="Login">
          </form>
          </div></body></html>`;
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.response.status = data.code;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify({
          message: data.message,
        });
      }
    });

    this.#oauth.post("/:id/login", async (ctx) => {
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

          const shop = shops.find((x) => x.public_id == ctx.params.id);

          if (shop == undefined) {
            throw new Error("Not connected to shop");
          }

          const KID = shop.public_id;
          const iat = Math.floor(Date.now() / 1000);
          const exp = iat + 15 * 60;
          const claims = {
            iat,
            exp,
            shopId: shop.public_id,
            adminId: admin.public_id,
          };

          const jwt = await new jose.SignJWT(claims)
            .setProtectedHeader({ typ: "JWT", alg: "HS256", kid: KID })
            .sign(SHARED_SECRET_KEY);

          ctx.cookies.set("TurquozeAuth", jwt, {
            sameSite: "strict",
            path: `/admin/oauth/${ctx.params.id}`,
          });

          const redirectData = form.get("redirect");
          const redirect = redirectData?.replace("?redirect=", "");

          ctx.response.redirect(redirect ?? "/admin/oauth/logout");
        } else {
          throw new Error("No username/passord");
        }
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.response.status = data.code;
        ctx.response.body = `<html><head></head><body><div>
          <h3>Error: ${data.message}</h3>
          <form method="POST">
            <input type="hidden" name="redirect" value="${ctx.request.url.search}">
            <input type="email" name="email">
            <input type="password" name="password">
            <input type="submit" value="Login">
          </form>
          </div></body></html>`;
      }
    });

    this.#oauth.get("/:id/authorize", CookieGuard(container), (ctx) => {
      try {
        ctx.response.body =
          `<html><head></head><body><div><form method="POST"><input type="submit" value="Approve"></form> </div></body></html>`;
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.response.status = data.code;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify({
          message: data.message,
        });
      }
    });

    this.#oauth.post("/:id/authorize", CookieGuard(container), (ctx) => {
      try {
        const response_type = ctx?.params?.response_type;

        if (response_type == "code") {
          const _client_id = ctx?.params?.client_id;
          const redirect_uri = ctx?.params?.redirect_uri;
          const _scope = ctx?.params?.scope;
          const state = ctx?.params?.state;

          //TODO: redirect to redirect url
          const url = new URLSearchParams(redirect_uri!);
          url.set("state", state!);
          url.set("code", "1111");

          ctx.response.redirect(url.toString());
        }

        ctx.response.body = stringifyJSON({});
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.response.status = data.code;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify({
          message: data.message,
        });
      }
    });

    this.#oauth.post("/token", (ctx) => {
      try {
        const grant_type = ctx?.params?.grant_type;

        if (grant_type == "authorization_code") {
          const _client_id = ctx?.params?.client_id;
          const _client_secret = ctx?.params?.client_secret;
          const _redirect_uri = ctx?.params?.redirect_uri;
          const _code = ctx?.params?.code;

          //TODO: generate token
          const tokenResponse = {
            "token_type": "Bearer",
            "expires_in": 86400,
            "access_token":
              "jnv3mENAYS1wGEdUQPvjzWgKv6K_xgVxw1CmyYNdWvBS44ezea9nescVpHo5SsVLnSpnelhP",
            "scope": "photo offline_access",
            "refresh_token": "gp8HUtNrVc0-pbwYsn3qmknW",
          };

          ctx.response.body = stringifyJSON(tokenResponse);
        }

        ctx.response.body = stringifyJSON({});
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
    return this.#oauth.routes();
  }
}
