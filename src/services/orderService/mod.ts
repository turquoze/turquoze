import type postgresClient from "../dataClient/client.ts";
import IOrderService from "../interfaces/orderService.ts";
import { Order } from "../../utils/types.ts";
import { DatabaseError } from "../../utils/errors.ts";
import ICacheService from "../interfaces/cacheService.ts";
import { stringifyJSON } from "../../utils/utils.ts";

export default class CartService implements IOrderService {
  client: typeof postgresClient;
  cache: ICacheService;
  constructor(client: typeof postgresClient, cache: ICacheService) {
    this.client = client;
    this.cache = cache;
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
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }

  async Get(params: { id: string }): Promise<Order> {
    try {
      const cacheResult = await this.cache.get<Order>(params.id);

      if (cacheResult != null) {
        return cacheResult;
      }

      await this.client.connect();

      const result = await this.client.queryObject<Order>({
        text: "SELECT * FROM orders WHERE id = $1 LIMIT 1",
        args: [params.id],
      });

      await this.cache.set({
        id: params.id,
        data: stringifyJSON(result.rows[0]),
        expire: (60 * 60),
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

      const cacheResult = await this.cache.get<Array<Order>>(
        `ordersGetMany-${params.limit}-${params.offset}`,
      );

      if (cacheResult != null) {
        return cacheResult;
      }

      await this.client.connect();

      const result = await this.client.queryObject<Order>({
        text: "SELECT * FROM orders LIMIT $1 OFFSET $2",
        args: [params.limit, params.offset],
      });

      await this.cache.set({
        id: `ordersGetMany-${params.limit}-${params.offset}`,
        data: stringifyJSON(result.rows),
        expire: (60 * 10),
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
          "UPDATE orders SET payment.status = $1 WHERE id = $7 RETURNING id",
        args: [
          params.status,
          params.id,
        ],
      });

      await this.cache.delete(params.id);

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
