import { Router } from "../../deps.ts";
import type Container from "../../services/mod.ts";
import { TurquozeState } from "../../utils/types.ts";
import { ErrorHandler } from "../../utils/errors.ts";
import { stringifyJSON } from "../../utils/utils.ts";

export default class OAuthRoutes {
  #oauth: Router<TurquozeState>;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#oauth = new Router<TurquozeState>({
      prefix: "/oauth",
    });

    this.#oauth.get("/:id/authorize", (ctx) => {
      try {
        //TODO: is logged in
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

    this.#oauth.post("/:id/authorize", (ctx) => {
      try {
        //TODO: is logged in
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
        //TODO: is logged in
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
