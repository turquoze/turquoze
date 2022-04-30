import { Price } from "../../utils/types.ts";
import IPriceService from "../interfaces/priceService.ts";
import type postgresClient from "../dataClient/client.ts";
import { DatabaseError } from "../../utils/errors.ts";
import ICacheService from "../interfaces/cacheService.ts";

export default class PriceService implements IPriceService {
  client: typeof postgresClient;
  cache: ICacheService;
  constructor(client: typeof postgresClient, cache: ICacheService) {
    this.client = client;
    this.cache = cache;
  }

  async Create(params: { data: Price }): Promise<Price> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Price>({
        text:
          "INSERT INTO prices (amount, region, product) VALUES ($1, $2, $3) RETURNING id",
        args: [
          params.data.amount,
          params.data.region,
          params.data.product,
        ],
      });

      await this.cache.set({
        id: params.data.id,
        data: { price: params.data },
        expire: Date.now() + (60000 * 60),
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

  async Get(params: { id: string }): Promise<Price> {
    try {
      const cacheResult = await this.cache.get(params.id);

      if (cacheResult != null) {
        // @ts-expect-error wrong type
        return cacheResult.price;
      }

      await this.client.connect();

      const result = await this.client.queryObject<Price>({
        text: "SELECT * FROM prices WHERE id = $1 LIMIT 1",
        args: [params.id],
      });

      await this.cache.set({
        id: params.id,
        data: { price: result.rows[0] },
        expire: Date.now() + (60000 * 60),
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
    params: { offset?: string; limit?: number },
  ): Promise<Array<Price>> {
    try {
      if (params.limit == null) {
        params.limit = 10;
      }

      const cacheResult = await this.cache.get(
        `priceGetMany-${params.limit}-${params.offset}`,
      );

      if (cacheResult != null) {
        // @ts-expect-error wrong type
        return cacheResult.prices;
      }

      await this.client.connect();

      const result = await this.client.queryObject<Price>({
        text: "SELECT * FROM prices LIMIT $1 OFFSET $2",
        args: [params.limit, params.offset],
      });

      await this.cache.set({
        id: `priceGetMany-${params.limit}-${params.offset}`,
        data: { prices: result.rows },
        expire: Date.now() + (60000 * 10),
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

  async Update(params: { data: Price }): Promise<Price> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Price>({
        text: "UPDATE prices SET amount = $1 WHERE id = $2 RETURNING id",
        args: [
          params.data.amount,
          params.data.id,
        ],
      });

      await this.cache.set({
        id: params.data.id,
        data: { price: params.data },
        expire: Date.now() + (60000 * 60),
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

      await this.client.queryObject<Price>({
        text: "DELETE FROM prices WHERE id = $1",
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
