import IOrderService from "../interfaces/orderService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import { Order, orders } from "../../utils/schema.ts";
import { eq, type PostgresJsDatabase } from "../../deps.ts";

export default class CartService implements IOrderService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Create(params: { data: Order }): Promise<Order> {
    try {
      //@ts-ignore not on type
      const result = await this.db.insert(orders).values({
        paymentStatus: params.data.paymentStatus,
        priceTotal: params.data.priceTotal,
        products: params.data.products,
        shop: params.data.shop,
      }).returning();

      //@ts-ignore not on type
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
      //@ts-ignore not on type
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

      //@ts-ignore not on type
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

      //@ts-ignore not on type
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

      //@ts-ignore not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
