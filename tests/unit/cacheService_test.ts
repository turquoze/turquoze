import { assert, assertObjectMatch } from "../test_deps.ts";
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
          expire: 1,
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
      try {
        await cache.get("test-no");
        assert(false);
      } catch (_error) {
        assert(true);
      }
    },
  });

  await t.step({
    name: "Get Expired",
    fn: async () => {
      try {
        await cache.get(
          "test-expire",
        );
        assert(false);
      } catch (_error) {
        assert(true);
      }
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
      try {
        await cache.get("test");
        assert(false);
      } catch (_error) {
        assert(true);
      }
    },
  });
});
