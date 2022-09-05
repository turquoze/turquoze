// deno-lint-ignore-file prefer-const
import "https://deno.land/std@0.137.0/dotenv/load.ts";

let DATABASE_CERT: string | undefined;
let DATABASE_HOSTNAME: string | undefined;
let DATABASE_PASSWORD: string | undefined;
let DATABASE_USER: string | undefined;
let DATABASE: string | undefined;
let DATABASE_PORT: string | undefined;
let TOKEN: string | undefined;
let JWTKEY: string | undefined;
let UPSTASH_REDIS_REST_URL: string | undefined;
let UPSTASH_REDIS_REST_TOKEN: string | undefined;
let MEILIHOST: string | undefined;
let MEILIINDEX: string | undefined;
let MEILIAPIKEY: string | undefined;
let SUPABASE_KEY: string | undefined;
let SUPABASE_URL: string | undefined;

DATABASE_CERT = Deno.env.get("DATABASE_CERT");
if (!DATABASE_CERT) {
  throw new Error("environment variable DATABASE_CERT not set");
}

DATABASE_HOSTNAME = Deno.env.get("DATABASE_HOSTNAME");
if (!DATABASE_HOSTNAME) {
  throw new Error("environment variable DATABASE_HOSTNAME not set");
}

DATABASE_PASSWORD = Deno.env.get("DATABASE_PASSWORD");
if (!DATABASE_PASSWORD) {
  throw new Error("environment variable DATABASE_PASSWORD not set");
}

DATABASE_USER = Deno.env.get("DATABASE_USER");
if (!DATABASE_USER) {
  throw new Error("environment variable DATABASE_USER not set");
}

DATABASE = Deno.env.get("DATABASE");
if (!DATABASE) {
  throw new Error("environment variable DATABASE not set");
}

DATABASE_PORT = Deno.env.get("DATABASE_PORT");
if (!DATABASE_PORT) {
  throw new Error("environment variable DATABASE_PORT not set");
}

TOKEN = Deno.env.get("TOKEN");
if (!TOKEN) {
  throw new Error("environment variable TOKEN not set");
}

JWTKEY = Deno.env.get("JWTKEY");
if (!JWTKEY) {
  throw new Error("environment variable JWTKEY not set");
}

UPSTASH_REDIS_REST_URL = Deno.env.get("UPSTASH_REDIS_REST_URL");
if (!UPSTASH_REDIS_REST_URL) {
  throw new Error("environment variable UPSTASH_REDIS_REST_URL not set");
}

UPSTASH_REDIS_REST_TOKEN = Deno.env.get("UPSTASH_REDIS_REST_TOKEN");
if (!UPSTASH_REDIS_REST_TOKEN) {
  throw new Error("environment variable UPSTASH_REDIS_REST_TOKEN not set");
}

MEILIHOST = Deno.env.get("MEILIHOST");
if (!MEILIHOST) {
  throw new Error("environment variable MEILIHOST not set");
}

MEILIINDEX = Deno.env.get("MEILIINDEX");
if (!MEILIINDEX) {
  throw new Error("environment variable MEILIINDEX not set");
}

MEILIAPIKEY = Deno.env.get("MEILIAPIKEY");
if (!MEILIAPIKEY) {
  console.warn(
    "environment variable MEILIAPIKEY not set \n Using public access",
  );
}

SUPABASE_KEY = Deno.env.get("SUPABASE_KEY");
if (!SUPABASE_KEY) {
  throw new Error("environment variable SUPABASE_KEY not set");
}

SUPABASE_URL = Deno.env.get("SUPABASE_URL");
if (!SUPABASE_URL) {
  throw new Error("environment variable SUPABASE_URL not set");
}

export {
  DATABASE,
  DATABASE_CERT,
  DATABASE_HOSTNAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USER,
  JWTKEY,
  MEILIAPIKEY,
  MEILIHOST,
  MEILIINDEX,
  SUPABASE_KEY,
  SUPABASE_URL,
  TOKEN,
  UPSTASH_REDIS_REST_TOKEN,
  UPSTASH_REDIS_REST_URL,
};
