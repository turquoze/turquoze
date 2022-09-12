import IOrderService from "../interfaces/orderService.ts";
import { Order } from "../../utils/types.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { Pool } from "../../deps.ts";

export default class CartService implements IOrderService {
  pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  async Create(params: { data: Order }): Promise<Order> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Order>({
        text:
          "INSERT INTO orders (payment_status, price_total, products, shop) VALUES ($1, $2, $3, $4) RETURNING public_id",
        args: [
          params.data.payment_status,
          params.data.price_total,
          params.data.products,
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

  async Get(params: { id: string }): Promise<Order> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Order>({
        text: "SELECT * FROM orders WHERE public_id = $1 LIMIT 1",
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
  ): Promise<Order[]> {
    try {
      if (params.limit == null) {
        params.limit = 10;
      }

      const client = await this.pool.connect();

      const result = await client.queryObject<Order>({
        text: "SELECT * FROM orders LIMIT $1 OFFSET $2",
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

  async SetPaymentStatus(
    params: { id: string; status: "PAYED" | "WAITING" | "FAILED" },
  ): Promise<Order> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Order>({
        text:
          "UPDATE orders SET payment_status = $1 WHERE public_id = $7 RETURNING public_id",
        args: [
          params.status,
          params.id,
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
}
