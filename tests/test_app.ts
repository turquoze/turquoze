import Container from "../src/services/mod.ts";
import { dbClient, redis as redisClient, searchClient } from "./test_utils.ts";
import { MEILIAPIKEY, MEILIHOST, MEILIINDEX } from "./test_secrets.ts";
import SearchService from "../src/services/searchService/mod.ts";
import { Hono } from "hono";

const localContainer = new Container(dbClient, redisClient);
localContainer.SearchService = new SearchService(searchClient);

const app = new Hono({ strict: false });
//@ts-ignore not on type
localContainer.Shop.settings.meilisearch = {
  api_key: MEILIAPIKEY!,
  host: MEILIHOST!,
  index: MEILIINDEX!,
};
export const container = localContainer;

app.use("*", async (ctx, next) => {
  const shop = {
    id: 0,
    publicId: "6d14431e-6d57-4ab5-842b-b6604e2038c7",
    regions: ["SE"],
    paymentId: "",
    currency: "SEK",
    name: "test",
    url: "https://example.com",
    searchIndex: MEILIINDEX!,
    secret: "test",
    _signKey: new Uint8Array(),
    settings: {
      meilisearch: {
        api_key: MEILIAPIKEY!,
        host: MEILIHOST!,
        index: MEILIINDEX!,
      },
    },
    _role: "SUPERADMIN",
    shippingId: "",
  };
  //@ts-expect-error not on type
  ctx.set("request_data", shop);
  await next();
});

export default app;
