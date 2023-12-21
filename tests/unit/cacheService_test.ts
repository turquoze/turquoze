import { assert, assertObjectMatch } from "../test_deps.ts";
import cacheService from "../../src/services/cacheService/mod.ts";

const cache = new cacheService();

Deno.test("CacheService", {
  sanitizeOps: false,
  sanitizeResources: false,
  sanitizeExit: false,
}, async (t) => {
  await t.step({
    name: "Set",
    fn: async () => {
      try {
        await cache.set({
          data: {
            test: "1",
          },
          key: "test",
          expire: 60,
          shop: "123",
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
          data: {
            test: "1",
          },
          key: "test-expire",
          expire: 1,
          shop: "123",
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
      const data: Record<string, unknown> | null = await cache.get(
        "123",
        "test",
      );
      assertObjectMatch(data!, {
        test: "1",
      });
    },
  });

  await t.step({
    name: "Get No object",
    fn: async () => {
      try {
        await cache.get("123", "test-no");
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
        await cache.get("123", "test-expire");
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
        await cache.delete("123", "test");
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
        await cache.get("123", "test");
        assert(false);
      } catch (_error) {
        assert(true);
      }
    },
  });
});
