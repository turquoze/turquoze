import IReturnService from "../interfaces/returnService.ts";
import { OrderReturn } from "../../utils/types.ts";
import { DatabaseError } from "../../utils/errors.ts";
import { returns } from "../../utils/schema.ts";
import { eq, type PostgresJsDatabase } from "../../deps.ts";

export default class ReturnService implements IReturnService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Create(params: { data: OrderReturn }): Promise<OrderReturn> {
    try {
      const result = await this.db.insert(returns).values({
        orderId: params.data.orderId,
        shop: params.data.shop,
        items: params.data.items,
        status: params.data.status,
      }).returning();

      //@ts-ignore not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Update(params: { data: OrderReturn }): Promise<OrderReturn> {
    try {
      const result = await this.db.update(returns)
        .set({
          orderId: params.data.orderId,
          shop: params.data.shop,
          items: params.data.items,
          status: params.data.status,
        })
        .where(eq(returns.publicId, params.data.publicId))
        .returning();

      //@ts-ignore not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Get(params: { id: string }): Promise<OrderReturn> {
    try {
      const result = await this.db.select().from(returns).where(
        eq(returns.publicId, params.id),
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
  ): Promise<OrderReturn[]> {
    try {
      if (params.limit == undefined) {
        params.limit = 10;
      }

      if (params.offset == undefined) {
        params.offset = 0;
      }

      const result = await this.db.select().from(returns).where(
        eq(returns.shop, params.shop),
      ).limit(params.limit).offset(params.offset);
      //@ts-ignore not on type
      return result;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async SetReturnExported(params: { id: string }): Promise<OrderReturn> {
    try {
      const result = await this.db.update(returns)
        .set({
          exported: true,
        })
        .where(eq(returns.publicId, params.id))
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
