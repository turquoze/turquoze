import type postgresClient from "../dataClient/client.ts";
import IInventoryService from "../interfaces/inventoryService.ts";
import { Inventory } from "../../utils/types.ts";
import { DatabaseError } from "../../utils/errors.ts";

export default class CartService implements IInventoryService {
  pool: typeof postgresClient;
  constructor(pool: typeof postgresClient) {
    this.pool = pool;
  }

  async Create(params: { data: Inventory }): Promise<Inventory> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Inventory>({
        text:
          "INSERT INTO inventories (product, quantity, warehouse) VALUES ($1, $2, $3) RETURNING public_id",
        args: [
          params.data.product,
          params.data.quantity,
          params.data.warehouse,
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

  async Update(params: { data: Inventory }): Promise<Inventory> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Inventory>({
        text:
          "UPDATE inventories SET quantity = $1 WHERE public_id = $2 RETURNING public_id",
        args: [params.data.quantity, params.data.public_id],
      });

      client.release();
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Get(params: { id: string }): Promise<Inventory> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Inventory>({
        text: "SELECT * FROM inventories WHERE public_id = $1 LIMIT 1",
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

  async Delete(params: { id: string }): Promise<void> {
    try {
      const client = await this.pool.connect();

      await client.queryObject<Inventory>({
        text: "DELETE FROM inventories WHERE public_id = $1",
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
