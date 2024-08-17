import { TurquozeRole } from "../utils/types.ts";
import { createMiddleware } from "@hono/hono/factory";

const RoleGuard = (role: TurquozeRole) =>
  createMiddleware(async (ctx, next) => {
    const userRole = ctx.get("request_data")._role;
    if (isAllowed(role, userRole)) {
      await next();
    } else {
      ctx.res.headers.set("content-type", "application/json");
      return ctx.json({
        msg: "Not allowed",
        error: "NO_PERMISSION",
      }, 403);
    }
  });

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
