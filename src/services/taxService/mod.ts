import { Tax } from "../../utils/types.ts";
import ITaxService from "../interfaces/taxService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { Pool } from "../../deps.ts";

export default class TaxService implements ITaxService {
  pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  async Create(params: { data: Tax }): Promise<Tax> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Tax>({
        text:
          "INSERT INTO taxes (name, type, value, shop) VALUES ($1, $2, $3) RETURNING public_id",
        args: [
          params.data.name,
          params.data.type,
          params.data.value,
          params.data.shop,
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

  async Get(params: { id: string }): Promise<Tax> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Tax>({
        text: "SELECT * FROM taxes WHERE public_id = $1 LIMIT 1",
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

  async GetMany(
    params: {
      offset?: string | undefined;
      limit?: number | undefined;
      shop: string;
    },
  ): Promise<Tax[]> {
    try {
      if (params.limit == null) {
        params.limit = 10;
      }

      const client = await this.pool.connect();

      const result = await client.queryObject<Tax>({
        text: "SELECT * FROM taxes WHERE shop = $1 LIMIT $2 OFFSET $3",
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

      await client.queryObject<Tax>({
        text: "DELETE FROM taxes WHERE public_id = $1",
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
