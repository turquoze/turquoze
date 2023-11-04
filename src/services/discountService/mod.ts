import IDiscountService from "../interfaces/discountService.ts";
import { Discount } from "../../utils/types.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { discounts } from "../../utils/schema.ts";
import { eq } from "drizzle-orm";

export default class DiscountService implements IDiscountService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Create(params: { data: Discount }): Promise<Discount> {
    try {
      const result = await this.db.insert(discounts).values({
        //@ts-expect-error not in type
        type: params.data.type,
        value: params.data.value,
        shop: params.data.shop,
        validFrom: params.data.validFrom,
        validTo: params.data.validTo,
        code: params.data.code,
      }).returning();

      //@ts-expect-error not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Get(params: { id: string }): Promise<Discount> {
    try {
      const result = await this.db.select().from(discounts).where(
        eq(discounts.publicId, params.id),
      );
      //@ts-expect-error not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetByCode(params: { code: string }): Promise<Discount> {
    try {
      const result = await this.db.select().from(discounts).where(
        eq(discounts.code, params.code),
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
  ): Promise<Discount[]> {
    try {
      if (params.limit == undefined) {
        params.limit = 10;
      }

      if (params.offset == undefined) {
        params.offset = 0;
      }

      const result = await this.db.select().from(discounts).where(
        eq(discounts.shop, params.shop),
      ).limit(params.limit).offset(params.offset);
      // @ts-expect-error not on type
      return result;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Delete(params: { id: string }): Promise<void> {
    try {
      await this.db.delete(discounts).where(eq(discounts.publicId, params.id));
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
        //@ts-expect-error not on type
        return result[0];
      }
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
