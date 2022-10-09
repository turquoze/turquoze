import type { Context } from "../deps.ts";
import dbClient from "../clients/db.ts";

export const DBCloser = async (
  _ctx: Context,
  next: () => Promise<unknown>,
) => {
  await next();
  console.log(dbClient.available);
  console.log(dbClient.size);
  if (dbClient.available > 0 && dbClient.size > 0) {
    await dbClient.end();
  }
};

export default DBCloser;
