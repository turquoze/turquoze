import type postgresClient from "../dataClient/client.ts";
import IDiscountService from "../interfaces/discountService.ts";
import { Discount } from "../../utils/types.ts";
import { DatabaseError } from "../../utils/errors.ts";
import ICacheService from "../interfaces/cacheService.ts";

export default class DiscountService implements IDiscountService {
  client: typeof postgresClient;
  cache: ICacheService;
  constructor(client: typeof postgresClient, cache: ICacheService) {
    this.client = client;
    this.cache = cache;
  }

  async Create(params: { data: Discount }): Promise<Discount> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Discount>({
        text:
          "INSERT INTO discounts (type, value, region, valid_from, valid_to, code) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
        args: [
          params.data.type,
          params.data.value,
          params.data.region,
          params.data.valid_from,
          params.data.valid_to,
          params.data.code,
        ],
      });

      await this.cache.set({
        id: params.data.id,
        data: { discount: params.data },
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

  async Get(params: { id: string }): Promise<Discount> {
    try {
      const cacheResult = await this.cache.get(params.id);

      if (cacheResult != null) {
        // @ts-expect-error wrong type
        return cacheResult.discount;
      }

      await this.client.connect();

      const result = await this.client.queryObject<Discount>({
        text: "SELECT * FROM discounts WHERE id = $1 LIMIT 1",
        args: [params.id],
      });

      await this.cache.set({
        id: params.id,
        data: { discount: result.rows[0] },
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

  async GetByCode(params: { code: string }): Promise<Discount> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Discount>({
        text: "SELECT * FROM discounts WHERE code = $1 LIMIT 1",
        args: [params.code],
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
  ): Promise<Discount[]> {
    try {
      if (params.limit == null) {
        params.limit = 10;
      }

      const cacheResult = await this.cache.get(
        `discountGetMany-${params.limit}-${params.offset}`,
      );

      if (cacheResult != null) {
        // @ts-expect-error wrong type
        return cacheResult.discounts;
      }

      await this.client.connect();

      const result = await this.client.queryObject<Discount>({
        text: "SELECT * FROM discounts LIMIT $1 OFFSET $2",
        args: [params.limit, params.offset],
      });

      await this.cache.set({
        id: `discountGetMany-${params.limit}-${params.offset}`,
        data: { discounts: result.rows },
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

  async Delete(params: { id: string }): Promise<void> {
    try {
      await this.client.connect();

      await this.client.queryObject<void>({
        text: "DELETE FROM discounts WHERE id = $1",
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

  async Validate(params: { code: string }): Promise<Discount | undefined> {
    try {
      await this.client.connect();

      const data = await this.client.queryObject<Discount>({
        text: "SELECT * FROM discounts WHERE code = $1",
        args: [params.code],
      });

      if (data.rows.length > 0) {
        return data.rows[0];
      }
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }
}
