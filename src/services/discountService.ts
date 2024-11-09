import DataService from "./dataService.ts";
import { Discount } from "../utils/validator.ts";
import { discounts } from "../utils/schema.ts";
import { and, eq, PostgresJsDatabase } from "../deps.ts";
import { DatabaseError } from "../utils/errors.ts";

export default class DiscountService extends DataService<Discount> {
  constructor(db: PostgresJsDatabase) {
    super(db, discounts);
  }

  async GetByCode(params: { code: string }): Promise<Discount> {
    try {
      const result = await this.db.select().from(discounts).where(
        and(
          eq(discounts.deleted, false),
          eq(discounts.code, params.code),
        ),
      );

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Validate(params: { code: string }): Promise<Discount | undefined> {
    try {
      const result = await this.db.select().from(discounts).where(
        eq(discounts.code, params.code),
      );
      if (result.length > 0) {
        return result[0];
      }
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
