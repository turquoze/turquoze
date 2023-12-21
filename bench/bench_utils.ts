import { MeiliSearch } from "meilisearch";
import { DATABASE_URL, MEILIAPIKEY, MEILIHOST } from "./bench_secrets.ts";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(DATABASE_URL!);

//@ts-ignore test
export const dbClient = drizzle(client);

export const searchClient = new MeiliSearch({
  host: MEILIHOST!,
  apiKey: MEILIAPIKEY,
});
