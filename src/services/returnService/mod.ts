import IReturnService from "../interfaces/returnService.ts";
import { OrderReturn } from "../../utils/types.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { Pool } from "../../deps.ts";

export default class ReturnService implements IReturnService {
  pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  async Create(params: { data: OrderReturn }): Promise<OrderReturn> {
    try {
      const client = await this.pool.connect();

      //TODO: add new table
      const result = await client.queryObject<OrderReturn>({
        text:
          "INSERT INTO warehouses (address, country, name, shop) VALUES ($1, $2, $3, $4) RETURNING public_id",
        args: [
          params.data.order_id,
          params.data.shop,
          params.data.items,
          params.data.status,
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

  async Update(params: { data: OrderReturn }): Promise<OrderReturn> {
    try {
      const client = await this.pool.connect();

      //TODO: add new table
      const result = await client.queryObject<OrderReturn>({
        text:
          "UPDATE warehouses SET address = $1, country = $2, name = $3 WHERE public_id = $4 RETURNING public_id",
        args: [
          params.data.order_id,
          params.data.shop,
          params.data.items,
          params.data.status,
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

  async Get(params: { id: string }): Promise<OrderReturn> {
    try {
      const client = await this.pool.connect();

      //TODO: add new table
      const result = await client.queryObject<OrderReturn>({
        text: "SELECT * FROM warehouses WHERE public_id = $1 LIMIT 1",
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
    params: { offset?: string | undefined; limit?: number | undefined },
  ): Promise<OrderReturn[]> {
    try {
      if (params.limit == null) {
        params.limit = 10;
      }

      const client = await this.pool.connect();

      //TODO: add new table
      const result = await client.queryObject<OrderReturn>({
        text: "SELECT * FROM warehouses LIMIT $1 OFFSET $2",
        args: [params.limit, params.offset],
      });

      client.release();
      return result.rows;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
