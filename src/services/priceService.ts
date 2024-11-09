import DataService from "./dataService.ts";
import { Price } from "../utils/validator.ts";
import { prices } from "../utils/schema.ts";
import { and, eq, PostgresJsDatabase } from "../deps.ts";
import { DatabaseError } from "../utils/errors.ts";

export default class PriceService extends DataService<Price> {
  constructor(db: PostgresJsDatabase) {
    super(db, prices);
  }

  async GetByProduct(
    params: { productId: string; list?: string },
  ): Promise<Price> {
    try {
      if (params.list == undefined) {
        params.list = "Default";
      }

      const result = await this.db.select().from(prices).where(
        and(
          eq(prices.deleted, false),
          eq(prices.product, params.productId),
          eq(prices.list, params.list),
        ),
      );

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetManyByProduct(
    params: { productId: string; offset?: number; limit?: number },
  ): Promise<Price[]> {
    try {
      if (params.limit == undefined) {
        params.limit = 10;
      }

      if (params.offset == undefined) {
        params.offset = 0;
      }

      const result = await this.db.select().from(prices).where(
        and(
          eq(prices.deleted, false),
          eq(prices.product, params.productId),
        ),
      ).limit(params.limit).offset(params.offset);

      return result;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
