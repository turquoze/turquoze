// deno-lint-ignore-file prefer-const
import "https://deno.land/std@0.137.0/dotenv/load.ts";

let DATABASE_CERT: string | undefined;
let DATABASE_HOSTNAME: string | undefined;
let DATABASE_PASSWORD: string | undefined;
let DATABASE_USER: string | undefined;
let DATABASE: string | undefined;
let DATABASE_PORT: string | undefined;
let UPSTASH_REDIS_REST_URL: string | undefined;
let UPSTASH_REDIS_REST_TOKEN: string | undefined;
let SUPABASE_KEY: string | undefined;
let SUPABASE_URL: string | undefined;
let SHARED_SECRET: string | undefined;

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

UPSTASH_REDIS_REST_URL = Deno.env.get("UPSTASH_REDIS_REST_URL");
if (!UPSTASH_REDIS_REST_URL) {
  throw new Error("environment variable UPSTASH_REDIS_REST_URL not set");
}

UPSTASH_REDIS_REST_TOKEN = Deno.env.get("UPSTASH_REDIS_REST_TOKEN");
if (!UPSTASH_REDIS_REST_TOKEN) {
  throw new Error("environment variable UPSTASH_REDIS_REST_TOKEN not set");
}

SUPABASE_KEY = Deno.env.get("SUPABASE_KEY");
if (!SUPABASE_KEY) {
  throw new Error("environment variable SUPABASE_KEY not set");
}

SUPABASE_URL = Deno.env.get("SUPABASE_URL");
if (!SUPABASE_URL) {
  throw new Error("environment variable SUPABASE_URL not set");
}

SHARED_SECRET = Deno.env.get("SHARED_SECRET");
if (!SHARED_SECRET) {
  throw new Error("environment variable SHARED_SECRET not set");
}

export {
  DATABASE,
  DATABASE_CERT,
  DATABASE_HOSTNAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USER,
  SHARED_SECRET,
  SUPABASE_KEY,
  SUPABASE_URL,
  UPSTASH_REDIS_REST_TOKEN,
  UPSTASH_REDIS_REST_URL,
};
