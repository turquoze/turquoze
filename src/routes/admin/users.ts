import RoleGuard from "../../middleware/roleGuard.ts";
import type Container from "../../services/mod.ts";
import { Get, jsonResponse, stringifyJSON, Update } from "../../utils/utils.ts";
import { UuidSchema } from "../../utils/validator.ts";
import { insertUserSchema, User } from "../../utils/validator.ts";
import { Hono, parse } from "../../deps.ts";

export default class UsersRoutes {
  #users: Hono;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#users = new Hono({ strict: false });

    this.#users.get("/", RoleGuard("VIEWER"), async (ctx) => {
      const offset = parseInt(
        new URL(ctx.req.raw.url).searchParams.get("offset") ?? "",
      );
      const limit = parseInt(
        new URL(ctx.req.raw.url).searchParams.get("limit") ?? "",
      );

      const data = await this.#Container.UserService.GetMany({
        //@ts-expect-error not on type
        shop: ctx.get("request_data").publicId!,
        limit: isNaN(limit) ? undefined : limit,
        offset: isNaN(offset) ? undefined : offset,
      });

      return jsonResponse(
        stringifyJSON({
          users: data,
        }),
        200,
      );
    });

    this.#users.post("/", RoleGuard("ADMIN"), async (ctx) => {
      const user = await ctx.req.json();
      //@ts-expect-error not on type
      user.shop = ctx.get("request_data").publicId;

      const posted = parse(insertUserSchema, user);

      const data = await this.#Container.UserService.Create({
        data: posted,
      });
      return jsonResponse(
        stringifyJSON({
          users: data,
        }),
        200,
      );
    });

    this.#users.get("/:id", RoleGuard("VIEWER"), async (ctx) => {
      const { id } = parse(UuidSchema, {
        id: ctx.req.param("id"),
      });

      const data = await Get<User>(this.#Container, {
        id: `user_${id}`,
        promise: this.#Container.UserService.Get({
          id: id,
        }),
      });

      return jsonResponse(
        stringifyJSON({
          users: data,
        }),
        200,
      );
    });

    this.#users.put("/:id", RoleGuard("ADMIN"), async (ctx) => {
      const { id } = parse(UuidSchema, {
        id: ctx.req.param("id"),
      });

      const user = await ctx.req.json();
      user.publicId = id;
      //@ts-expect-error not on type
      user.shop = ctx.get("request_data").publicId;
      user.password = "_______";

      const posted = parse(insertUserSchema, user);

      const data = await Update<User>(this.#Container, {
        id: `user_${id}`,
        promise: this.#Container.UserService.Update({
          data: posted,
        }),
      });

      return jsonResponse(
        stringifyJSON({
          users: data,
        }),
        200,
      );
    });
  }

  routes() {
    return this.#users;
  }
}
