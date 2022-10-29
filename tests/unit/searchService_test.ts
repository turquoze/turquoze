import { assert } from "../test_deps.ts";
import { MEILIINDEX } from "../test_secrets.ts";
import searchService from "../../src/services/searchService/mod.ts";
import { searchClient } from "../test_utils.ts";

const search = new searchService(searchClient);

Deno.test("SearchService", {
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
}, async (t) => {
  await t.step({
    name: "Search",
    fn: async () => {
      try {
        const data = await search.ProductSearch({
          index: MEILIINDEX!,
          query: "bacon",
        }, searchClient);

        assert(data.hits.length > 0);
      } catch {
        assert(false);
      }
    },
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
  });

  await t.step({
    name: "Search - No result",
    fn: async () => {
      try {
        const data = await search.ProductSearch({
          index: MEILIINDEX!,
          query: "NOTHING 12343",
        }, searchClient);

        assert(data.hits.length <= 0);
      } catch {
        assert(false);
      }
    },
    sanitizeOps: false,
    sanitizeResources: false,
    sanitizeExit: false,
  });
});
