import IOrderService from "../interfaces/orderService.ts";
import { Order } from "../../utils/types.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { orders } from "../../utils/schema.ts";
import { eq } from "drizzle-orm";

export default class CartService implements IOrderService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Create(params: { data: Order }): Promise<Order> {
    try {
      //@ts-expect-error not on type
      const result = await this.db.insert(orders).values({
        paymentStatus: params.data.payment_status,
        priceTotal: params.data.price_total,
        products: params.data.products,
        shop: params.data.shop,
      }).returning();

      //@ts-expect-error not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Get(params: { id: string }): Promise<Order> {
    try {
      const result = await this.db.select().from(orders).where(
        eq(orders.publicId, params.id),
      );
      //@ts-expect-error not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetMany(
    params: {
      offset?: number | undefined;
      limit?: number | undefined;
      shop: string;
    },
  ): Promise<Order[]> {
    try {
      if (params.limit == undefined) {
        params.limit = 10;
      }

      if (params.offset == undefined) {
        params.offset = 0;
      }

      const result = await this.db.select().from(orders).where(
        eq(orders.shop, params.shop),
      ).limit(params.limit).offset(params.offset);
      // @ts-expect-error not on type
      return result;
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
      const result = await this.db.update(orders)
        .set({
          paymentStatus: params.status,
        })
        .where(eq(orders.publicId, params.id))
        .returning();

      //@ts-expect-error not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async SetOrderExported(params: { id: string }): Promise<Order> {
    try {
      const result = await this.db.update(orders)
        .set({
          exported: true,
        })
        .where(eq(orders.publicId, params.id))
        .returning();

      //@ts-expect-error not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
