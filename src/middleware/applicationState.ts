import type { Context } from "../deps.ts";
import { TurquozeState } from "../utils/types.ts";

export const ApplicationState = async (
  ctx: Context<TurquozeState>,
  next: () => Promise<unknown>,
) => {
  ctx.state.region = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
  await next();
};

export default ApplicationState;
