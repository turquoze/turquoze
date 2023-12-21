import { Hono } from "hono";
import Container from "../src/services/mod.ts";
import { dbClient, searchClient } from "./bench_utils.ts";
import { MEILIAPIKEY, MEILIHOST, MEILIINDEX } from "./bench_secrets.ts";
import SearchService from "../src/services/searchService/mod.ts";

const localContainer = new Container(dbClient);
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
    publicId: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
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
    _role: "VIEWER",
    shippingId: "",
  };
  //@ts-expect-error not on type
  ctx.set("request_data", shop);
  await next();
});

export default app;
