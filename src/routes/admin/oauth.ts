import { Router } from "@oakserver/oak";
import type Container from "../../services/mod.ts";
import { TurquozeState } from "../../utils/types.ts";
import { ErrorHandler } from "../../utils/errors.ts";
import { stringifyJSON } from "../../utils/utils.ts";
import CookieGuard from "../../middleware/cookieGuard.ts";
import { SHARED_SECRET } from "../../utils/secrets.ts";
import { nanoid } from "nanoid";
import * as jose from "jose";
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
            id: admin.publicId,
          });

          const shop = shops.find((x) => x.publicId == ctx.params.id);

          if (shop == undefined) {
            throw new Error("Not connected to shop");
          }

          const KID = shop.publicId;
          const iat = Math.floor(Date.now() / 1000);
          const exp = iat + 15 * 60;
          const claims = {
            iat,
            exp,
            shopId: shop.publicId,
            adminId: admin.publicId,
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

    this.#oauth.post("/:id/authorize", CookieGuard(container), async (ctx) => {
      try {
        const response_type = ctx?.params?.response_type;

        if (response_type == "code") {
          const client_id = ctx?.params?.client_id;
          const redirect_uri = ctx?.params?.redirect_uri;
          const scope = ctx?.params?.scope;
          const state = ctx?.params?.state;
          const tokenPlugin = ctx.params?.token;
          const namePlugin = ctx.params?.name;

          const plugin = await this.#Container.PluginService.Create({
            data: {
              id: 0,
              publicId: "",
              name: namePlugin ?? client_id ?? "_NO_NAME_",
              shop: ctx.params.id,
              token: tokenPlugin ?? "",
              //@ts-expect-error not typed
              type: scope ?? "MISC",
              url: redirect_uri!,
            },
          });

          const refresh = nanoid();

          const token = await this.#Container.OauthService.Create({
            data: {
              id: 0,
              publicId: "",
              plugin: plugin.publicId,
              token: refresh,
              expiresAt: null, // TODO: null is never have to delete plugin from shop.
            },
          });

          const url = new URLSearchParams(redirect_uri!);
          url.set("state", state!);
          url.set("code", token.publicId);

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

    this.#oauth.post("/token", async (ctx) => {
      try {
        const grant_type = ctx?.params?.grant_type;

        if (grant_type == "authorization_code") {
          const _client_id = ctx?.params?.client_id;
          const _client_secret = ctx?.params?.client_secret;
          const code = ctx?.params?.code;

          if (code == undefined) {
            throw new Error("No code in request");
          }

          const token = await this.#Container.OauthService.Get({
            id: code,
          });

          const plugin = await this.#Container.PluginService.Get({
            id: token.plugin,
          });

          const iat = Math.floor(Date.now() / 1000);
          const exp = iat + 15 * 60;
          const nbf = iat;
          const claims = {
            iat,
            exp,
            nbf,
            shopId: plugin.shop,
            plugin: plugin.publicId,
            type: plugin.type,
          };

          const jwt = await new jose.SignJWT(claims)
            .setProtectedHeader({ typ: "JWT", alg: "HS256", kid: plugin.shop })
            .sign(SHARED_SECRET_KEY);

          const tokenResponse = {
            "token_type": "Bearer",
            "expires_in": exp,
            "access_token": jwt,
            "scope": plugin.type,
            "refresh_token": token.token,
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
