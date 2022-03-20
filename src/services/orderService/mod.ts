import type postgresClient from "../dataClient/client.ts";
import IOrderService from "../interfaces/orderService.ts";
import { Order } from "../../utils/types.ts";

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
          "INSERT INTO orders (payment, price, products, region) VALUES ($1, $2, $3, $4) RETURNING id",
        args: [
          params.data.payment,
          params.data.price,
          params.data.products,
          params.data.region,
        ],
      });

      return result.rows[0];
    } catch (error) {
      throw new Error("DB error", {
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
        text: "SELECT * FROM orders WHERE id = $1 LIMIT 1",
        args: [params.id],
      });

      return result.rows[0];
    } catch (error) {
      throw new Error("DB error", {
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
      await this.client.connect();

      if (params.limit == null) {
        params.limit = 10;
      }
      const result = await this.client.queryObject<Order>({
        text: "SELECT * FROM orders LIMIT $1 OFFSET $2",
        args: [params.limit, params.offset],
      });

      return result.rows;
    } catch (error) {
      throw new Error("DB error", {
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
          "UPDATE orders SET payment.status = $1 WHERE id = $7 RETURNING id",
        args: [
          params.status,
          params.id,
        ],
      });

      return result.rows[0];
    } catch (error) {
      throw new Error("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }
}
