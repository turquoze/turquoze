import { assert } from "../test_deps.ts";
import searchService from "../../src/services/searchService/mod.ts";

const search = new searchService();

Deno.test("SearchService", async (t) => {
  await t.step({
    name: "Search",
    fn: async () => {
      try {
        const data = await search.ProductSearch({
          data: {
            query: "bo",
            shop: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
          },
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
          data: {
            query: "NOTHING 12343",
            shop: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
          },
        });

        assert(data.length <= 0);
      } catch {
        assert(false);
      }
    },
  });
});
