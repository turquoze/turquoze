import type postgresClient from "../dataClient/client.ts";
import IWarehouseService from "../interfaces/warehouseService.ts";
import { Warehouse } from "../../utils/types.ts";
import { DatabaseError } from "../../utils/errors.ts";

export default class CartService implements IWarehouseService {
  pool: typeof postgresClient;
  constructor(pool: typeof postgresClient) {
    this.pool = pool;
  }

  async Create(params: { data: Warehouse }): Promise<Warehouse> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Warehouse>({
        text:
          "INSERT INTO warehouses (address, country, name, shop) VALUES ($1, $2, $3, $4) RETURNING public_id",
        args: [
          params.data.address,
          params.data.country,
          params.data.name,
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

  async Update(params: { data: Warehouse }): Promise<Warehouse> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Warehouse>({
        text:
          "UPDATE warehouses SET address = $1, country = $2, name = $3 WHERE public_id = $4 RETURNING public_id",
        args: [
          params.data.address,
          params.data.country,
          params.data.name,
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

  async Get(params: { id: string }): Promise<Warehouse> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Warehouse>({
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
  ): Promise<Warehouse[]> {
    try {
      if (params.limit == null) {
        params.limit = 10;
      }

      const client = await this.pool.connect();

      const result = await client.queryObject<Warehouse>({
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

  async Delete(params: { id: string }): Promise<void> {
    try {
      const client = await this.pool.connect();

      await client.queryObject<Warehouse>({
        text: "DELETE FROM warehouses WHERE public_id = $1",
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
