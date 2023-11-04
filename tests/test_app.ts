import { Application } from "../src/deps.ts";
import type { TurquozeState } from "../src/utils/types.ts";
import Container from "../src/services/mod.ts";
import { dbClient, redis as redisClient, searchClient } from "./test_utils.ts";
import { MEILIAPIKEY, MEILIHOST, MEILIINDEX } from "./test_secrets.ts";
import SearchService from "../src/services/searchService/mod.ts";

const container = new Container(dbClient, redisClient);
container.SearchService = new SearchService(searchClient);

const app = new Application<TurquozeState>();
container.Shop.settings.meilisearch = {
  api_key: MEILIAPIKEY!,
  host: MEILIHOST!,
  index: MEILIINDEX!,
};
app.state.container = container;

app.use(async (ctx, next) => {
  ctx.state.shop = "6d14431e-6d57-4ab5-842b-b6604e2038c7";
  ctx.state.request_data = {
    id: 0,
    publicId: "6d14431e-6d57-4ab5-842b-b6604e2038c7",
    regions: ["SE"],
    paymentId: "",
    currency: "SEK",
    name: "test",
    url: "https://example.com",
    search_index: MEILIINDEX!,
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
  await next();
});

export default app;
