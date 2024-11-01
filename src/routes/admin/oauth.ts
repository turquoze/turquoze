import { jose } from "../../deps.ts";
import type Container from "../../services/mod.ts";
import { ErrorHandler } from "../../utils/errors.ts";
import CookieGuard from "../../middleware/cookieGuard.ts";
import { Hono, nanoid, setCookie } from "../../deps.ts";

export default class OAuthRoutes {
  #oauth: Hono;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#oauth = new Hono({ strict: false });

    this.#oauth.get("/:id/login", (ctx) => {
      try {
        return ctx.html(`<html><head></head><body><div>
          <form method="POST">
            <input type="hidden" name="redirect" value="${
          new URL(ctx.req.raw.url).search
        }">
            <input type="email" name="email">
            <input type="password" name="password">
            <input type="submit" value="Login">
          </form>
          </div></body></html>`);
      } catch (error) {
        const data = ErrorHandler(error as Error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#oauth.post("/:id/login", async (ctx) => {
      try {
        const form = await ctx.req.formData();

        const email = form.get("email")?.toString();
        const password = form.get("password")?.toString();

        if (email != null && password != null) {
          const admin = await this.#Container.AdminService.Login({
            email,
            password,
          });

          const shops = await this.#Container.ShopLinkService.GetShops({
            id: admin.publicId!,
          });

          //@ts-expect-error not on type
          const shop = shops.find((x) => x.publicId == ctx.req.param("id"));

          if (shop == undefined) {
            throw new Error("Not connected to shop");
          }
          //@ts-expect-error not on type
          const KID = shop.publicId;
          const iat = Math.floor(Date.now() / 1000);
          const exp = iat + 15 * 60;
          const claims = {
            iat,
            exp,
            //@ts-expect-error not on type
            shopId: shop.publicId,
            adminId: admin.publicId,
          };
          //@ts-expect-error not on type
          const SECRET_KEY = ctx.get("key_sign_key");
          //@ts-expect-error not on type
          const SHARED_SECRET_KEY = new TextEncoder().encode(SECRET_KEY);

          const jwt = await new jose.SignJWT(claims)
            .setProtectedHeader({ typ: "JWT", alg: "HS256", kid: KID })
            .sign(SHARED_SECRET_KEY);

          setCookie(ctx, "TurquozeAuth", jwt, {
            sameSite: "Strict",
            path: `/admin/oauth/${ctx.req.param("id")}`,
          });

          const redirectData = form.get("redirect");
          const redirect = redirectData?.toString()?.replace("?redirect=", "");

          return ctx.redirect(redirect ?? "/admin/oauth/logout");
        } else {
          throw new Error("No username/passord");
        }
      } catch (error) {
        const data = ErrorHandler(error as Error);
        return ctx.html(
          `<html><head></head><body><div>
          <h3>Error: ${data.message}</h3>
          <form method="POST">
            <input type="hidden" name="redirect" value="${
            new URL(ctx.req.raw.url).search
          }">
            <input type="email" name="email">
            <input type="password" name="password">
            <input type="submit" value="Login">
          </form>
          </div></body></html>`,
          data.code,
        );
      }
    });

    this.#oauth.get("/:id/authorize", CookieGuard(container), (ctx) => {
      try {
        return ctx.html(
          `<html><head></head><body><div><form method="POST"><input type="submit" value="Approve"></form> </div></body></html>`,
        );
      } catch (error) {
        const data = ErrorHandler(error as Error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#oauth.post("/:id/authorize", CookieGuard(container), async (ctx) => {
      try {
        const response_type = ctx.req.query("response_type");

        if (response_type == "code") {
          const client_id = ctx.req.query("client_id");
          const redirect_uri = ctx.req.query("redirect_uri");
          const scope = ctx.req.query("scope");
          const state = ctx.req.query("state");
          const tokenPlugin = ctx.req.query("token");
          const namePlugin = ctx.req.query("name");

          const plugin = await this.#Container.PluginService.Create({
            data: {
              publicId: "",
              name: namePlugin ?? client_id ?? "_NO_NAME_",
              shop: ctx.req.param("id"),
              token: tokenPlugin ?? "",
              type: scope ?? "MISC",
              url: redirect_uri!,
            },
          });

          const refresh = nanoid();

          const token = await this.#Container.OauthService.Create({
            data: {
              id: 0,
              publicId: "",
              plugin: plugin.publicId!,
              token: refresh,
              expiresAt: null, // TODO: null is never have to delete plugin from shop.
            },
          });

          const url = new URLSearchParams(redirect_uri!);
          url.set("state", state!);
          url.set("code", token.publicId);

          ctx.redirect(url.toString());
        }

        return ctx.json({});
      } catch (error) {
        const data = ErrorHandler(error as Error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });

    this.#oauth.post("/token", async (ctx) => {
      try {
        const grant_type = ctx.req.query("grant_type");

        if (grant_type == "authorization_code") {
          const _client_id = ctx.req.query("client_id");
          const _client_secret = ctx.req.query("client_secret");
          const code = ctx.req.query("code");

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
          //@ts-expect-error not on type
          const SECRET_KEY = ctx.get("key_sign_key");
          //@ts-expect-error not on type
          const SHARED_SECRET_KEY = new TextEncoder().encode(SECRET_KEY);

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

          return ctx.json(tokenResponse);
        }

        return ctx.json({});
      } catch (error) {
        const data = ErrorHandler(error as Error);
        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          message: data.message,
        }, data.code);
      }
    });
  }

  routes() {
    return this.#oauth;
  }
}
