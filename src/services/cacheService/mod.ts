import ICacheService from "../interfaces/cacheService.ts";
import { Redis } from "../../deps.ts";
import {
  UPSTASH_REDIS_REST_TOKEN,
  UPSTASH_REDIS_REST_URL,
} from "../../utils/secrets.ts";

const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL!,
  token: UPSTASH_REDIS_REST_TOKEN!,
});

export default class CacheService implements ICacheService {
  async get<T>(id: string): Promise<T | null> {
    try {
      const data = await redis.get<T>(id);
      return data;
    } catch (_error) {
      return null;
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
      await redis.set(params.id, params.data, {
        ex: params.expire,
      });
    } catch (_error) {
      return;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await redis.del(id);
    } catch (_error) {
      return;
    }
  }
}
