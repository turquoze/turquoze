import { MeiliSearch, Redis } from "../src/deps.ts";
import {
  DATABASE_URL,
  MEILIAPIKEY,
  MEILIHOST,
  UPSTASH_REDIS_REST_TOKEN,
  UPSTASH_REDIS_REST_URL,
} from "./test_secrets.ts";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(DATABASE_URL!);

//@ts-ignore test
export const dbClient = drizzle(client);

export const searchClient = new MeiliSearch({
  host: MEILIHOST!,
  apiKey: MEILIAPIKEY,
});

export const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL!,
  token: UPSTASH_REDIS_REST_TOKEN!,
});
