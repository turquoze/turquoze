import { Router } from "@oakserver/oak";
import type Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";
import { LoginRequest, TurquozeState } from "../../utils/types.ts";
import { stringifyJSON } from "../../utils/utils.ts";
import { LoginSchema } from "../../utils/validator.ts";
import * as jose from "jose";
import { parse } from "valibot";

export default class UsersRoutes {
  #users: Router<TurquozeState>;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#users = new Router({
      prefix: "/users",
    });

    this.#users.get("/me", async (ctx) => {
      try {
        const result = await jose.jwtVerify(
          "",
          ctx.state.request_data._signKey,
        );
        //@ts-expect-error err
        const id = result.payload.user.publicId;
        const data = await this.#Container.UserService.Get({ id });

        ctx.response.body = stringifyJSON({
          users: data,
        });
        ctx.response.headers.set("content-type", "application/json");
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.response.status = data.code;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify({
          message: data.message,
        });
      }
    });

    this.#users.post("/login", async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const body = ctx.request.body();
        let login: LoginRequest;
        if (body.type === "json") {
          login = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        login.shop = ctx.state.request_data.publicId!;

        const posted = parse(LoginSchema, login);

        const data = await this.#Container.UserService.Login({
          email: posted.email,
          password: posted.password,
          shop: posted.shop,
        });

        const jwt = await new jose.SignJWT({
          "user": {
            email: data.email,
            name: data.name,
            id: data.publicId,
          },
        })
          .setProtectedHeader({ alg: "PS256" })
          .setIssuedAt()
          .setIssuer("urn:turquoze:shop")
          .setAudience("urn:turquoze:user")
          .setNotBefore("1s")
          .setExpirationTime("1h")
          .sign(ctx.state.request_data._signKey);

        ctx.response.body = stringifyJSON({
          token: jwt,
        });
        ctx.response.headers.set("content-type", "application/json");
      } catch (error) {
        const data = ErrorHandler(error);
        ctx.response.status = data.code;
        ctx.response.headers.set("content-type", "application/json");
        ctx.response.body = JSON.stringify({
          message: data.message,
        });
      }
    });

    this.#users.put("/update-password", async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const body = ctx.request.body();
        let login: LoginRequest;
        if (body.type === "json") {
          login = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        login.shop = ctx.state.request_data.publicId!;

        const posted = parse(LoginSchema, login);

        const data = await this.#Container.UserService.UpdatePassword({
          email: posted.email,
          new_password: posted.password,
          shop: posted.shop,
        });

        ctx.response.body = stringifyJSON({
          users: data,
        });
        ctx.response.headers.set("content-type", "application/json");
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
    return this.#users.routes();
  }
}
