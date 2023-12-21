// deno-lint-ignore-file prefer-const
let DATABASE_URL: string | undefined;
let MEILIHOST: string | undefined;
let MEILIINDEX: string | undefined;
let MEILIAPIKEY: string | undefined;

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

export { DATABASE_URL, MEILIAPIKEY, MEILIHOST, MEILIINDEX };
