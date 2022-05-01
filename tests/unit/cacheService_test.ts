import { assert, assertEquals, assertObjectMatch } from "../test_deps.ts";
import cacheService from "../../src/services/cacheService/mod.ts";
import { stringifyJSON } from "../../src/utils/utils.ts";

const cache = new cacheService();

Deno.test("CacheService", async (t) => {
  await t.step({
    name: "Set",
    fn: async () => {
      try {
        await cache.set({
          data: stringifyJSON({
            test: "1",
          }),
          id: "test",
          expire: 60,
        });
        assert(true);
      } catch {
        assert(false);
      }
    },
  });

  await t.step({
    name: "Set with expire",
    fn: async () => {
      try {
        await cache.set({
          data: stringifyJSON({
            test: "1",
          }),
          id: "test-expire",
          expire: Date.now(),
        });
        assert(true);
      } catch {
        assert(false);
      }
    },
  });

  await t.step({
    name: "Get",
    fn: async () => {
      const data: Record<string, unknown> | null = await cache.get("test");
      assertObjectMatch(data!, {
        test: "1",
      });
    },
  });

  await t.step({
    name: "Get No object",
    fn: async () => {
      const data: Record<string, unknown> | null = await cache.get("test-no");
      assertEquals(data!, null);
    },
  });

  await t.step({
    name: "Get Expired",
    fn: async () => {
      const data: Record<string, unknown> | null = await cache.get(
        "test-expire",
      );
      assertEquals(data, null);
    },
  });

  await t.step({
    name: "Delete",
    fn: async () => {
      try {
        await cache.delete("test");
        assert(true);
      } catch {
        assert(false);
      }
    },
  });

  await t.step({
    name: "Null cache",
    fn: async () => {
      const data: Record<string, unknown> | null = await cache.get("test");
      assertEquals(data, null);
    },
  });
});
