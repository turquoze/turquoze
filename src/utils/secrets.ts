// deno-lint-ignore-file prefer-const
let UPSTASH_REDIS_REST_URL: string | undefined;
let UPSTASH_REDIS_REST_TOKEN: string | undefined;
let SHARED_SECRET: string | undefined;
let DATABASE_URL: string | undefined;

UPSTASH_REDIS_REST_URL = Deno.env.get("UPSTASH_REDIS_REST_URL");
if (!UPSTASH_REDIS_REST_URL) {
  throw new Error("environment variable UPSTASH_REDIS_REST_URL not set");
}

UPSTASH_REDIS_REST_TOKEN = Deno.env.get("UPSTASH_REDIS_REST_TOKEN");
if (!UPSTASH_REDIS_REST_TOKEN) {
  throw new Error("environment variable UPSTASH_REDIS_REST_TOKEN not set");
}

SHARED_SECRET = Deno.env.get("SHARED_SECRET");
if (!SHARED_SECRET) {
  throw new Error("environment variable SHARED_SECRET not set");
}

DATABASE_URL = Deno.env.get("DATABASE_URL");
if (!DATABASE_URL) {
  throw new Error("environment variable DATABASE_URL not set");
}

export {
  DATABASE_URL,
  SHARED_SECRET,
  UPSTASH_REDIS_REST_TOKEN,
  UPSTASH_REDIS_REST_URL,
};
