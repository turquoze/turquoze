import DataService from "./dataService.ts";
import { Order } from "../utils/validator.ts";
import { orders } from "../utils/schema.ts";
import { eq, PostgresJsDatabase } from "../deps.ts";
import { DatabaseError } from "../utils/errors.ts";

export default class OrderService extends DataService<Order> {
  constructor(db: PostgresJsDatabase) {
    super(db, orders);
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
