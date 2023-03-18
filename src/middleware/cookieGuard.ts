import { Context } from "../deps.ts";
import { Container } from "../services/mod.ts";
import { TurquozeState } from "../utils/types.ts";

export const CookieGuard =
  (container: Container) =>
  async (ctx: Context<TurquozeState>, next: () => Promise<unknown>) => {
    const authCookie = await ctx.cookies.get("TurquozeAuth");

    try {
      if (authCookie != undefined && authCookie != null) {
        const admin = await container.AdminService.Get({ id: authCookie });

        ctx.state.adminId = admin.public_id;

        await next();
      } else {
        throw new Error("Not allowed");
      }
    } catch (_error) {
      ctx.response.redirect("/ui/auth/login");
    }
  };

export default CookieGuard;
