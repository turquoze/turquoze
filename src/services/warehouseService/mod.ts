import type postgresClient from "../dataClient/client.ts";
import IWarehouseService from "../interfaces/warehouseService.ts";
import { Warehouse } from "../../utils/types.ts";
import { DatabaseError } from "../../utils/errors.ts";
import ICacheService from "../interfaces/cacheService.ts";
import { stringifyJSON } from "../../utils/utils.ts";

export default class CartService implements IWarehouseService {
  client: typeof postgresClient;
  cache: ICacheService;
  constructor(client: typeof postgresClient, cache: ICacheService) {
    this.client = client;
    this.cache = cache;
  }

  async Create(params: { data: Warehouse }): Promise<Warehouse> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Warehouse>({
        text:
          "INSERT INTO warehouses (address, country, name, region) VALUES ($1, $2, $3, $4) RETURNING id",
        args: [
          params.data.address,
          params.data.country,
          params.data.name,
          params.data.region,
        ],
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

  async Update(params: { data: Warehouse }): Promise<Warehouse> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Warehouse>({
        text:
          "UPDATE warehouses SET address = $1, country = $2, name = $3 WHERE id = $4 RETURNING id",
        args: [
          params.data.address,
          params.data.country,
          params.data.name,
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

  async Get(params: { id: string }): Promise<Warehouse> {
    try {
      const cacheResult = await this.cache.get<Warehouse>(params.id);

      if (cacheResult != null) {
        return cacheResult;
      }

      await this.client.connect();

      const result = await this.client.queryObject<Warehouse>({
        text: "SELECT * FROM warehouses WHERE id = $1 LIMIT 1",
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

  async GetMany(
    params: { offset?: string | undefined; limit?: number | undefined },
  ): Promise<Warehouse[]> {
    try {
      if (params.limit == null) {
        params.limit = 10;
      }

      const cacheResult = await this.cache.get<Array<Warehouse>>(
        `warehouseGetMany-${params.limit}-${params.offset}`,
      );

      if (cacheResult != null) {
        return cacheResult;
      }

      await this.client.connect();

      const result = await this.client.queryObject<Warehouse>({
        text: "SELECT * FROM warehouses LIMIT $1 OFFSET $2",
        args: [params.limit, params.offset],
      });

      await this.cache.set({
        id: `warehouseGetMany-${params.limit}-${params.offset}`,
        data: stringifyJSON(result.rows),
        expire: (60 * 10),
      });

      return result.rows;
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

      await this.client.queryObject<Warehouse>({
        text: "DELETE FROM warehouses WHERE id = $1",
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
