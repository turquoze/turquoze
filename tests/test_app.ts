import Container from "../src/services/mod.ts";
import { dbClient, searchClient } from "./test_utils.ts";
import { MEILIAPIKEY, MEILIHOST, MEILIINDEX } from "./test_secrets.ts";
import SearchService from "../src/services/searchService/mod.ts";
import { Hono } from "../src/deps.ts";
import { SHOP_ID } from "./test_utils.ts";

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
    publicId: SHOP_ID,
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
