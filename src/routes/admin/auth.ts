import { Hono, jose } from "../../deps.ts";
import type Container from "../../services/mod.ts";

export default class AuthRoutes {
  #auth: Hono;
  #Container: Container;
  constructor(container: Container) {
    this.#Container = container;
    this.#auth = new Hono({ strict: false });

    this.#auth.post("/login", async (ctx) => {
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

        const shopsClean = shops.map((shop) => {
          return {
            //@ts-expect-error not on type
            publicId: shop.publicId,
            role: shop.role,
          };
        });

        const iat = Math.floor(Date.now() / 1000);
        const exp = iat + 15 * 60;
        const claims = {
          iat,
          exp,
          shops: JSON.stringify(shopsClean),
          adminId: admin.publicId,
        };

        const iatRefresh = Math.floor(Date.now() / 1000);
        const expRefresh = iatRefresh + 60 * 60;
        const claimsRefresh = {
          iat: iatRefresh,
          exp: expRefresh,
          adminId: admin.publicId,
        };
        //@ts-expect-error not on type
        const SECRET_KEY = ctx.get("key_sign_key");
        //@ts-expect-error not on type
        const SHARED_SECRET_KEY = new TextEncoder().encode(SECRET_KEY);

        const jwt = await new jose.SignJWT(claims)
          .setProtectedHeader({ typ: "JWT", alg: "HS256" })
          .sign(SHARED_SECRET_KEY);

        const refresh = await new jose.SignJWT(claimsRefresh)
          .setProtectedHeader({ typ: "JWT", alg: "HS256" })
          .sign(SHARED_SECRET_KEY);

        ctx.res.headers.set("content-type", "application/json");
        return ctx.json({
          token: jwt,
          refreshToken: refresh,
          expire: exp,
          name: admin.name,
        });
      } else {
        throw new Error("No username/passord");
      }
    });
  }

  routes() {
    return this.#auth;
  }
}
