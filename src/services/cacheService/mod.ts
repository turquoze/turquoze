import ICacheService from "../interfaces/cacheService.ts";
import { Redis } from "@upstash/redis";

export default class CacheService implements ICacheService {
  #redis: Redis;

  constructor(redis: Redis) {
    this.#redis = redis;
  }

  async get<T>(id: string): Promise<T> {
    try {
      const data = await this.#redis.get<T>(id);
      if (data == null) {
        throw new Error("Not in cache");
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async set(
    params: {
      id: string;
      data: string;
      expire: number;
    },
  ): Promise<void> {
    try {
      await this.#redis.set(params.id, params.data, {
        ex: params.expire,
      });
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.#redis.del(id);
    } catch (error) {
      throw error;
    }
  }
}
