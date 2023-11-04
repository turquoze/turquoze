// deno-lint-ignore-file prefer-const
let DATABASE_URL: string | undefined;
let MEILIHOST: string | undefined;
let MEILIINDEX: string | undefined;
let MEILIAPIKEY: string | undefined;
let UPSTASH_REDIS_REST_URL: string | undefined;
let UPSTASH_REDIS_REST_TOKEN: string | undefined;

DATABASE_URL = Deno.env.get("TEST_DATABASE_URL");
if (!DATABASE_URL) {
  throw new Error("environment variable TEST_DATABASE_URL not set");
}

MEILIHOST = Deno.env.get("TEST_MEILIHOST");
if (!MEILIHOST) {
  throw new Error("environment variable TEST_MEILIHOST not set");
}

MEILIINDEX = Deno.env.get("TEST_MEILIINDEX");
if (!MEILIINDEX) {
  throw new Error("environment variable TEST_MEILIINDEX not set");
}

MEILIAPIKEY = Deno.env.get("TEST_MEILIAPIKEY");
if (!MEILIAPIKEY) {
  console.warn(
    "environment variable TEST_MEILIAPIKEY not set \n Using public access",
  );
}

UPSTASH_REDIS_REST_URL = Deno.env.get("TEST_UPSTASH_REDIS_REST_URL");
if (!UPSTASH_REDIS_REST_URL) {
  throw new Error("environment variable TEST_UPSTASH_REDIS_REST_URL not set");
}

UPSTASH_REDIS_REST_TOKEN = Deno.env.get("TEST_UPSTASH_REDIS_REST_TOKEN");
if (!UPSTASH_REDIS_REST_TOKEN) {
  throw new Error("environment variable TEST_UPSTASH_REDIS_REST_TOKEN not set");
}

export {
  DATABASE_URL,
  MEILIAPIKEY,
  MEILIHOST,
  MEILIINDEX,
  UPSTASH_REDIS_REST_TOKEN,
  UPSTASH_REDIS_REST_URL,
};
