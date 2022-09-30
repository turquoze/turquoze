import { assert } from "../test_deps.ts";
import searchService from "../../src/services/searchService/mod.ts";
import { searchClient } from "../test_utils.ts";
import { MEILIINDEX } from "../test_secrets.ts";

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
        });

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
        });

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
