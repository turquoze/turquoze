// deno-lint-ignore-file prefer-const
let SHARED_SECRET: string | undefined;
let DATABASE_URL: string | undefined;
let RUN_DB_MIGRATION: string | undefined;

SHARED_SECRET = Deno.env.get("SHARED_SECRET");
if (!SHARED_SECRET) {
  throw new Error("environment variable SHARED_SECRET not set");
}

DATABASE_URL = Deno.env.get("DATABASE_URL");
if (!DATABASE_URL) {
  throw new Error("environment variable DATABASE_URL not set");
}

RUN_DB_MIGRATION = Deno.env.get("RUN_DB_MIGRATION");

export { DATABASE_URL, RUN_DB_MIGRATION, SHARED_SECRET };
