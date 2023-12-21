import cacheService from "../../src/services/cacheService/mod.ts";

const cache = new cacheService();

Deno.bench("CacheService - Set", {}, async () => {
  try {
    await cache.set({
      data: {
        test: "1",
      },
      key: "test",
      expire: 60,
      shop: "123",
    });
    // deno-lint-ignore no-empty
  } catch {}
});

Deno.bench("CacheService - Set Expire", {}, async () => {
  try {
    await cache.set({
      data: {
        test: "1",
      },
      key: "test-expire",
      expire: 1,
      shop: "123",
    });
    // deno-lint-ignore no-empty
  } catch {}
});

Deno.bench("CacheService - Get", {}, async () => {
  try {
    await cache.get("123", "test");
    // deno-lint-ignore no-empty
  } catch {}
});

Deno.bench("CacheService - Get No object", {}, async () => {
  try {
    await cache.get("123", "test-no");
    // deno-lint-ignore no-empty
  } catch {}
});

Deno.bench("CacheService - Get Expired", {}, async () => {
  try {
    await cache.get("123", "test-expire");
    // deno-lint-ignore no-empty
  } catch {}
});

Deno.bench("CacheService - Delete", {}, async () => {
  try {
    await cache.delete("123", "test");
    // deno-lint-ignore no-empty
  } catch {}
});

Deno.bench("CacheService - Null cache", {}, async () => {
  try {
    await cache.get("123", "test");
    // deno-lint-ignore no-empty
  } catch {}
});
