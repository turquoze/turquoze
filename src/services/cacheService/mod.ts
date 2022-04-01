import ICacheService from "../interfaces/cacheService.ts";

const cache = new Map<string, {
  data: Record<string, unknown>;
  expire: number | null;
}>();

export default class CacheService implements ICacheService {
  async get(id: string): Promise<Record<string, unknown>> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    if (cache.has(id)) {
      const data = cache.get(id);
      if (data?.expire != undefined) {
        if (data.expire < Date.now()) {
          cache.delete(id);
          return {};
        }
        return data.data;
      }
      return data?.data ?? {};
    }
    return {};
  }

  async set(
    params: {
      id: string;
      data: Record<string, unknown>;
      expire: number | null;
    },
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    cache.set(params.id, {
      data: params.data,
      expire: params.expire,
    });
  }

  async delete(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 0));
    cache.delete(id);
  }
}
