import type { Context } from "../deps.ts";
import { TurquozeRole, TurquozeState } from "../utils/types.ts";

export const RoleGuard =
  (role: TurquozeRole) =>
  async (ctx: Context<TurquozeState>, next: () => Promise<unknown>) => {
    const userRole = ctx.state.request_data._role;
    if (isAllowed(role, userRole)) {
      await next();
    } else {
      ctx.response.status = 401;
      ctx.response.headers.set("content-type", "application/json");
      ctx.response.body = JSON.stringify({
        msg: "Not allowed",
        error: "NO_TOKEN",
      });
    }
  };

function isAllowed(role: TurquozeRole, userRole: TurquozeRole): boolean {
  if (role == "SUPERADMIN") {
    if (userRole == "SUPERADMIN") {
      return true;
    }
    return false;
  } else if (role == "ADMIN") {
    if (userRole == "SUPERADMIN" || userRole == "ADMIN") {
      return true;
    }
    return false;
  } else if (role == "WEBSITE") {
    if (
      userRole == "SUPERADMIN" || userRole == "ADMIN" || userRole == "WEBSITE"
    ) {
      return true;
    }
    return false;
  } else if (role == "VIEWER") {
    if (
      userRole == "SUPERADMIN" || userRole == "ADMIN" ||
      userRole == "WEBSITE" || userRole == "VIEWER"
    ) {
      return true;
    }
    return false;
  } else if (role == "USER") {
    if (
      userRole == "SUPERADMIN" || userRole == "ADMIN" ||
      userRole == "WEBSITE" || userRole == "VIEWER" || userRole == "USER"
    ) {
      return true;
    }
    return false;
  }

  return false;
}

export default RoleGuard;
