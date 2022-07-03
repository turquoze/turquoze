import { assert } from "../test_deps.ts";
import searchService from "../../src/services/searchService/mod.ts";

const search = new searchService();

Deno.test("SearchService", async (t) => {
  await t.step({
    name: "Search",
    fn: async () => {
      try {
        const data = await search.ProductSearch({
          query: "bo",
        });

        assert(data.hits.length > 0);
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
          query: "NOTHING 12343",
        });

        assert(data.hits.length <= 0);
      } catch {
        assert(false);
      }
    },
  });
});
