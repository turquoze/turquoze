import type postgresClient from "../dataClient/client.ts";
import IOrderService from "../interfaces/orderService.ts";
import { Order } from "../../utils/types.ts";
import { DatabaseError } from "../../utils/errors.ts";

export default class CartService implements IOrderService {
  client: typeof postgresClient;
  constructor(client: typeof postgresClient) {
    this.client = client;
  }

  async Create(params: { data: Order }): Promise<Order> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Order>({
        text:
          "INSERT INTO orders (payment, price, products, shop) VALUES ($1, $2, $3, $4) RETURNING public_id",
        args: [
          params.data.payment,
          params.data.price,
          params.data.products,
          params.data.shop,
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

  async Get(params: { id: string }): Promise<Order> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Order>({
        text: "SELECT * FROM orders WHERE public_id = $1 LIMIT 1",
        args: [params.id],
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
  ): Promise<Order[]> {
    try {
      if (params.limit == null) {
        params.limit = 10;
      }

      await this.client.connect();

      const result = await this.client.queryObject<Order>({
        text: "SELECT * FROM orders LIMIT $1 OFFSET $2",
        args: [params.limit, params.offset],
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

  async SetPaymentStatus(
    params: { id: string; status: "PAYED" | "WAITING" | "FAILED" },
  ): Promise<Order> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Order>({
        text:
          "UPDATE orders SET payment.status = $1 WHERE public_id = $7 RETURNING public_id",
        args: [
          params.status,
          params.id,
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
}
