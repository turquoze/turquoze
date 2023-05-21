import IDiscountService from "../interfaces/discountService.ts";
import { Discount } from "../../utils/types.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { Pool } from "../../deps.ts";

export default class DiscountService implements IDiscountService {
  pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  async Create(params: { data: Discount }): Promise<Discount> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Discount>({
        text:
          "INSERT INTO discounts (type, value, shop, valid_from, valid_to, code) VALUES ($1, $2, $3, $4, $5, $6) RETURNING public_id",
        args: [
          params.data.type,
          params.data.value,
          params.data.shop,
          params.data.valid_from,
          params.data.valid_to,
          params.data.code,
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

  async Get(params: { id: string }): Promise<Discount> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Discount>({
        text: "SELECT * FROM discounts WHERE public_id = $1 LIMIT 1",
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

  async GetByCode(params: { code: string }): Promise<Discount> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Discount>({
        text: "SELECT * FROM discounts WHERE code = $1 LIMIT 1",
        args: [params.code],
      });

      client.release();
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetMany(
    params: {
      offset?: string | undefined;
      limit?: number | undefined;
      shop: string;
    },
  ): Promise<Discount[]> {
    try {
      if (params.limit == null) {
        params.limit = 10;
      }

      const client = await this.pool.connect();

      const result = await client.queryObject<Discount>({
        text: "SELECT * FROM discounts WHERE shop = $1 LIMIT $2 OFFSET $3",
        args: [params.shop, params.limit, params.offset],
      });

      client.release();
      return result.rows;
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
        text: "DELETE FROM discounts WHERE public_id = $1",
        args: [params.id],
      });

      client.release();
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Validate(params: { code: string }): Promise<Discount | undefined> {
    try {
      const client = await this.pool.connect();

      const data = await client.queryObject<Discount>({
        text: "SELECT * FROM discounts WHERE code = $1",
        args: [params.code],
      });

      client.release();
      if (data.rows.length > 0) {
        return data.rows[0];
      }
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
