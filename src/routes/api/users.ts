import { Router } from "../../deps.ts";
import Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";
import { User } from "../../utils/types.ts";

import { stringifyJSON } from "../../utils/utils.ts";
import { UserSchema, UuidSchema } from "../../utils/validator.ts";

export default class UsersRoutes {
  #users: Router;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#users = new Router({
      prefix: "/users",
    });

    this.#users.get("/", async (ctx) => {
      try {
        const data = await this.#Container.UserService.GetMany({});
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

        user.region = ctx.state.region;

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
        console.log(error)
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

        const data = await this.#Container.UserService.Get({
          id: ctx.params.id,
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

        user.system_id = ctx.params.id;
        user.region = ctx.state.region;

        await UserSchema.validate(user);
        const posted: User = await UserSchema.cast(user);

        const data = await this.#Container.UserService.Update({
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
  }

  routes() {
    return this.#users.routes();
  }
}
