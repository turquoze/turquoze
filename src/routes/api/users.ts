import { jose, Router } from "../../deps.ts";
import Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";
import { LoginRequest, TurquozeState, User } from "../../utils/types.ts";

import { Get, stringifyJSON, Update } from "../../utils/utils.ts";
import { LoginSchema, UserSchema, UuidSchema } from "../../utils/validator.ts";

export default class UsersRoutes {
  #users: Router<TurquozeState>;
  #Container: typeof Container;
  constructor(container: typeof Container) {
    this.#Container = container;
    this.#users = new Router({
      prefix: "/users",
    });

    this.#users.get("/", async (ctx) => {
      try {
        const data = await Get<Array<User>>({
          id: `usersGetMany-${10}-${undefined}`,
          promise: this.#Container.UserService.GetMany({}),
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

    this.#users.post("/", async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const body = ctx.request.body();
        let user: User;
        if (body.type === "json") {
          user = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        user.shop = ctx.state.shop;

        await UserSchema.validate(user);
        const posted: User = await UserSchema.cast(user);

        const data = await this.#Container.UserService.Create({
          data: posted,
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

    this.#users.get("/:id", async (ctx) => {
      try {
        await UuidSchema.validate({
          id: ctx.params.id,
        });

        const data = await Get<User>({
          id: `user_${ctx.params.id}`,
          promise: this.#Container.UserService.Get({
            id: ctx.params.id,
          }),
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

        login.shop = ctx.state.shop;

        await LoginSchema.validate(login);
        const posted: LoginRequest = await LoginSchema.cast(login);

        const data = await this.#Container.UserService.Login({
          email: posted.email,
          password: posted.password,
          shop: posted.shop,
        });

        const jwt = await new jose.SignJWT({
          "user": {
            email: data.email,
            name: data.name,
            id: data.public_id,
          },
        })
          .setProtectedHeader({ alg: "PS256" })
          .setIssuedAt()
          .setIssuer("urn:turquoze:shop")
          .setAudience("urn:turquoze:user")
          .setNotBefore("")
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

        login.shop = ctx.state.shop;

        await LoginSchema.validate(login);
        const posted: LoginRequest = await LoginSchema.cast(login);

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

    this.#users.put("/:id", async (ctx) => {
      try {
        if (!ctx.request.hasBody) {
          throw new NoBodyError("No Body");
        }

        const body = ctx.request.body();
        let user: User;
        if (body.type === "json") {
          user = await body.value;
        } else {
          throw new NoBodyError("Wrong content-type");
        }

        user.public_id = ctx.params.id;
        user.shop = ctx.state.shop;

        await UserSchema.validate(user);
        const posted: User = await UserSchema.cast(user);

        const data = await Update<User>({
          id: `user_${ctx.params.id}`,
          promise: this.#Container.UserService.Update({
            data: posted,
          }),
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
