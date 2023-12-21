import ICacheService from "../interfaces/cacheService.ts";

export default class CacheService implements ICacheService {
  #cache: Array<{ shop: string; key: string; data: string; expired: number }>;

  constructor() {
    this.#cache = [];
  }

  async get<T>(shop: string, key: string): Promise<T> {
    try {
      const data = this.#cache.find((x) =>
        x.key == key && x.shop == shop && x.expired < Date.now()
      );
      if (data == undefined) {
        throw new Error("Not in cache");
      }
      await new Promise((resolve) => setTimeout(resolve, 5));
      return JSON.parse(data.data);
    } catch (error) {
      throw error;
    }
  }

  async set<T>(
    params: {
      shop: string;
      key: string;
      data: T;
      expire?: number;
    },
  ): Promise<void> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 5));
      this.#cache.push({
        data: JSON.stringify(params.data),
        expired: params.expire ?? 9999999999,
        key: params.key,
        shop: params.shop,
      });
    } catch (error) {
      throw error;
    }
  }

  async delete(shop: string, key: string): Promise<void> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 5));
      const i = this.#cache.findIndex((x) => x.key == key && x.shop == shop);
      if (i > -1) {
        this.#cache.splice(i, 1);
      }
    } catch (error) {
      throw error;
    }
  }
}
