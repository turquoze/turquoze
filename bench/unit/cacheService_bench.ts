import cacheService from "../../src/services/cacheService/mod.ts";
import { stringifyJSON } from "../../src/utils/utils.ts";
import { redis } from "../bench_utils.ts";

const cache = new cacheService(redis);

Deno.bench("CacheService - Set", {}, async () => {
  try {
    await cache.set({
      data: stringifyJSON({
        test: "1",
      }),
      id: "test",
      expire: 60,
    });
    // deno-lint-ignore no-empty
  } catch {}
});

Deno.bench("CacheService - Set Expire", {}, async () => {
  try {
    await cache.set({
      data: stringifyJSON({
        test: "1",
      }),
      id: "test-expire",
      expire: 1,
    });
    // deno-lint-ignore no-empty
  } catch {}
});

Deno.bench("CacheService - Get", {}, async () => {
  try {
    await cache.get("test");
    // deno-lint-ignore no-empty
  } catch {}
});

Deno.bench("CacheService - Get No object", {}, async () => {
  try {
    await cache.get("test-no");
    // deno-lint-ignore no-empty
  } catch {}
});

Deno.bench("CacheService - Get Expired", {}, async () => {
  try {
    await cache.get(
      "test-expire",
    );
    // deno-lint-ignore no-empty
  } catch {}
});

Deno.bench("CacheService - Delete", {}, async () => {
  try {
    await cache.delete("test");
    // deno-lint-ignore no-empty
  } catch {}
});

Deno.bench("CacheService - Null cache", {}, async () => {
  try {
    await cache.get("test");
    // deno-lint-ignore no-empty
  } catch {}
});
