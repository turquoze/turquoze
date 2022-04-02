import { assert } from "../../deps.ts";
import searchService from "./mod.ts";
import client from "../dataClient/client.ts";

const search = new searchService(client);

Deno.test("SearchService", async (t) => {
  await t.step({
    name: "Search",
    fn: async () => {
      try {
        const data = await search.ProductSearch({
          query: "test",
        });

        assert(data.length > 0);
      } catch {
        assert(false);
      }
    },
  });

  await t.step({
    name: "Search - No result",
    fn: async () => {
      try {
        const data = await search.ProductSearch({
          query: "NOTHING",
        });

        assert(data.length <= 0);
      } catch {
        assert(false);
      }
    },
  });
});
