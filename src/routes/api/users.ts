import { Router } from "../../deps.ts";
import Container from "../../services/mod.ts";
import { ErrorHandler, NoBodyError } from "../../utils/errors.ts";
import { User } from "../../utils/types.ts";

import { stringifyJSON } from "../../utils/utils.ts";
import { UserSchema } from "../../utils/validator.ts";

export default class UsersRoutes {
  #users: Router;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#users = new Router({
      prefix: "/users",
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
  }

  routes() {
    return this.#users.routes();
  }
}
