import { drizzle, MeiliSearch, postgres } from "../src/deps.ts";
import { DATABASE_URL, MEILIAPIKEY, MEILIHOST } from "./bench_secrets.ts";

const client = postgres(DATABASE_URL!);

//@ts-ignore test
export const dbClient = drizzle(client);

export const searchClient = new MeiliSearch({
  host: MEILIHOST!,
  apiKey: MEILIAPIKEY,
});
