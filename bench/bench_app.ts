import { Application } from "@oakserver/oak";
import type { TurquozeState } from "../src/utils/types.ts";
import Container from "../src/services/mod.ts";
import { dbClient, redis as redisClient, searchClient } from "./bench_utils.ts";
import { MEILIAPIKEY, MEILIHOST, MEILIINDEX } from "./bench_secrets.ts";
import SearchService from "../src/services/searchService/mod.ts";

const container = new Container(dbClient, redisClient);
container.SearchService = new SearchService(searchClient);

const app = new Application<TurquozeState>();
app.state.container = container;

app.use(async (ctx, next) => {
  ctx.state.shop = "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1";
  ctx.state.request_data = {
    id: 0,
    publicId: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
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
    _role: "VIEWER",
    shippingId: "",
  };
  await next();
});

export default app;
