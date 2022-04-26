// deno-lint-ignore-file
import "https://deno.land/x/dotenv@v3.2.0/load.ts";

let DATABASE_CERT: string | undefined;
let DATABASE_HOSTNAME: string | undefined;
let DATABASE_PASSWORD: string | undefined;
let DATABASE_USER: string | undefined;
let DATABASE: string | undefined;
let DATABASE_PORT: string | undefined;
let TOKEN: string | undefined;
let JWTKEY: string | undefined;

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

export {
  DATABASE,
  DATABASE_CERT,
  DATABASE_HOSTNAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USER,
  JWTKEY,
  TOKEN,
};
