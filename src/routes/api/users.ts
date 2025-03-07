import { Hono, jose, parse } from "../../deps.ts";
import type Container from "../../services/mod.ts";
import { jsonResponse, stringifyJSON } from "../../utils/utils.ts";
import { LoginSchema } from "../../utils/validator.ts";
import { Shop } from "../../utils/validator.ts";

export default class UsersRoutes {
  #users: Hono;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#users = new Hono({ strict: false });

    this.#users.get("/me", async (ctx) => {
      const result = await jose.jwtVerify(
        //TODO: fix
        "",
        //@ts-expect-error not on type
        ctx.get("request_data")._signKey,
      );
      //@ts-expect-error err
      const id = result.payload.user.publicId;
      const data = await this.#Container.UserService.Get({ id });

      return jsonResponse(
        stringifyJSON({
          users: data,
        }),
        200,
      );
    });

    this.#users.post("/login", async (ctx) => {
      const login = await ctx.req.json();
      //@ts-expect-error not on type
      const request_data = ctx.get("request_data") as Shop;
      login.shop = request_data.publicId!;

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
        .sign(request_data._signKey);

      ctx.res.headers.set("content-type", "application/json");
      return ctx.json({
        token: jwt,
      });
    });

    this.#users.put("/update-password", async (ctx) => {
      const login = await ctx.req.json();
      //@ts-expect-error not on type
      login.shop = ctx.get("request_data").publicId!;

      const posted = parse(LoginSchema, login);

      const data = await this.#Container.UserService.UpdatePassword({
        email: posted.email,
        new_password: posted.password,
        shop: posted.shop,
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
