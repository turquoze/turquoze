import { drizzle, MeiliSearch, postgres } from "../src/deps.ts";
import { DATABASE_URL, MEILIAPIKEY, MEILIHOST } from "./test_secrets.ts";

const client = postgres(DATABASE_URL!);

//@ts-ignore test
export const dbClient = drizzle(client);

export const searchClient = new MeiliSearch({
  host: MEILIHOST!,
  apiKey: MEILIAPIKEY,
});

export const SHOP_ID = "43e946b4-6625-4037-be6e-70c2ce035cbf";
export const PRODUCT_ID = "c164cdf7-3df7-4574-afbf-e4a7a31e9d6d";
export const WAREHOUSE_ID = "4925ea94-0ba7-4533-8fcd-a362c099270d";
export const CATEGORY_ID = "3ad959be-5d32-4bd2-ac55-50153ee952e3";
