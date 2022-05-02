import type postgresClient from "../dataClient/client.ts";
import IRegionService from "../interfaces/regionService.ts";
import { Region } from "../../utils/types.ts";
import { DatabaseError } from "../../utils/errors.ts";
import ICacheService from "../interfaces/cacheService.ts";
import { stringifyJSON } from "../../utils/utils.ts";

export default class RegionService implements IRegionService {
  client: typeof postgresClient;
  cache: ICacheService;
  constructor(client: typeof postgresClient, cache: ICacheService) {
    this.client = client;
    this.cache = cache;
  }

  async Create(params: { data: Region }): Promise<Region> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Region>({
        text:
          "INSERT INTO regions (name, currency, regions) VALUES ($1, $2, $3) RETURNING id",
        args: [params.data.name, params.data.currency, params.data.regions],
      });

      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }

  async Get(params: { id: string }): Promise<Region> {
    try {
      try {
        return await this.cache.get<Region>(params.id);
        // deno-lint-ignore no-empty
      } catch {}

      await this.client.connect();

      const result = await this.client.queryObject<Region>({
        text: "SELECT * FROM regions WHERE id = $1 LIMIT 1",
        args: [params.id],
      });

      await this.cache.set({
        id: params.id,
        data: stringifyJSON(result.rows[0]),
        expire: (60 * 60),
      });

      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }

  async Update(params: { data: Region }): Promise<Region> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Region>({
        text:
          "UPDATE regions SET name = $1, currency = $2, regions = $3 WHERE id = $4 RETURNING id",
        args: [
          params.data.name,
          params.data.currency,
          params.data.regions,
          params.data.id,
        ],
      });

      await this.cache.set({
        id: params.data.id,
        data: stringifyJSON(params.data),
        expire: (60 * 60),
      });

      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }

  async Delete(params: { id: string }): Promise<void> {
    try {
      await this.client.connect();

      await this.client.queryObject<void>({
        text: "DELETE FROM regions WHERE id = $1",
        args: [params.id],
      });

      await this.cache.delete(params.id);
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }
}
