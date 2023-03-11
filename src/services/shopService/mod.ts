import IShopService from "../interfaces/shopService.ts";
import { Shop } from "../../utils/types.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { Pool } from "../../deps.ts";

export default class ShopService implements IShopService {
  pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  async Create(params: { data: Shop }): Promise<Shop> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Shop>({
        text:
          "INSERT INTO shops (name, currency, regions, payment_id, shipping_id, url, search_index, settings) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING public_id",
        args: [
          params.data.name,
          params.data.currency,
          params.data.regions,
          params.data.payment_id,
          params.data.shipping_id,
          params.data.url,
          params.data.search_index,
          params.data.settings,
        ],
      });

      client.release();
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Get(params: { id: string }): Promise<Shop> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Shop>({
        text: "SELECT * FROM shops WHERE public_id = $1 LIMIT 1",
        args: [params.id],
      });

      client.release();
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Update(params: { data: Shop }): Promise<Shop> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Shop>({
        text:
          "UPDATE shops SET name = $1, currency = $2, regions = $3, payment_id = $4, shipping_id = $5, url = $6, search_index = $7, settings = $8 WHERE public_id = $9 RETURNING public_id",
        args: [
          params.data.name,
          params.data.currency,
          params.data.regions,
          params.data.payment_id,
          params.data.shipping_id,
          params.data.url,
          params.data.search_index,
          params.data.settings,
          params.data.public_id,
        ],
      });

      client.release();
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Delete(params: { id: string }): Promise<void> {
    try {
      const client = await this.pool.connect();

      await client.queryObject<void>({
        text: "DELETE FROM shops WHERE public_id = $1",
        args: [params.id],
      });

      client.release();
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
