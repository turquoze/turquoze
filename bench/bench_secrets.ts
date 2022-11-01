// deno-lint-ignore-file prefer-const
import "https://deno.land/std@0.137.0/dotenv/load.ts";

let DATABASE_CERT: string | undefined;
let DATABASE_HOSTNAME: string | undefined;
let DATABASE_PASSWORD: string | undefined;
let DATABASE_USER: string | undefined;
let DATABASE: string | undefined;
let DATABASE_PORT: string | undefined;
let MEILIHOST: string | undefined;
let MEILIINDEX: string | undefined;
let MEILIAPIKEY: string | undefined;
let UPSTASH_REDIS_REST_URL: string | undefined;
let UPSTASH_REDIS_REST_TOKEN: string | undefined;

DATABASE_CERT = Deno.env.get("TEST_DATABASE_CERT");
if (!DATABASE_CERT) {
  throw new Error("environment variable TEST_DATABASE_CERT not set");
}

DATABASE_HOSTNAME = Deno.env.get("TEST_DATABASE_HOSTNAME");
if (!DATABASE_HOSTNAME) {
  throw new Error("environment variable TEST_DATABASE_HOSTNAME not set");
}

DATABASE_PASSWORD = Deno.env.get("TEST_DATABASE_PASSWORD");
if (!DATABASE_PASSWORD) {
  throw new Error("environment variable TEST_DATABASE_PASSWORD not set");
}

DATABASE_USER = Deno.env.get("TEST_DATABASE_USER");
if (!DATABASE_USER) {
  throw new Error("environment variable TEST_DATABASE_USER not set");
}

DATABASE = Deno.env.get("TEST_DATABASE");
if (!DATABASE) {
  throw new Error("environment variable TEST_DATABASE not set");
}

DATABASE_PORT = Deno.env.get("TEST_DATABASE_PORT");
if (!DATABASE_PORT) {
  throw new Error("environment variable TEST_DATABASE_PORT not set");
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
  DATABASE,
  DATABASE_CERT,
  DATABASE_HOSTNAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USER,
  MEILIAPIKEY,
  MEILIHOST,
  MEILIINDEX,
  UPSTASH_REDIS_REST_TOKEN,
  UPSTASH_REDIS_REST_URL,
};
