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
          data: {
            query: "test",
            region: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
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
            query: "NOTHING",
            region: "d9cf2573-56f5-4f02-b82d-3f9db43dd0f1",
          },
        });

        assert(data.length <= 0);
      } catch {
        assert(false);
      }
    },
  });
});
