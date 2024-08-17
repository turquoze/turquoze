import IDiscountService from "../interfaces/discountService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import { discounts } from "../../utils/schema.ts";
import { and, eq, type PostgresJsDatabase } from "../../deps.ts";
import { Discount } from "../../utils/validator.ts";

export default class DiscountService implements IDiscountService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Create(params: { data: Discount }): Promise<Discount> {
    try {
      //@ts-ignore not on type
      const result = await this.db.insert(discounts).values({
        type: params.data.type,
        value: params.data.value,
        shop: params.data.shop,
        validFrom: params.data.validFrom,
        validTo: params.data.validTo,
        code: params.data.code,
      }).returning();

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Get(params: { id: string }): Promise<Discount> {
    try {
      //@ts-expect-error not on type
      const result = await this.db.select().from(discounts).where(
        and(
          //@ts-expect-error not on type
          eq(discounts.deleted, false),
          //@ts-expect-error not on type
          eq(discounts.publicId, params.id),
        ),
      );

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetByCode(params: { code: string }): Promise<Discount> {
    try {
      //@ts-expect-error not on type
      const result = await this.db.select().from(discounts).where(
        and(
          //@ts-expect-error not on type
          eq(discounts.deleted, false),
          //@ts-expect-error not on type
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

      //@ts-expect-error not on type
      const result = await this.db.select().from(discounts).where(
        and(
          //@ts-expect-error not on type
          eq(discounts.deleted, false),
          //@ts-expect-error not on type
          eq(discounts.shop, params.shop),
        ),
      ).limit(params.limit).offset(params.offset);

      return result;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Delete(params: { id: string }): Promise<void> {
    try {
      //@ts-expect-error not on type
      await this.db.update(discounts).set({
        deleted: true,
        //@ts-expect-error not on type
      }).where(eq(discounts.publicId, params.id));
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Validate(params: { code: string }): Promise<Discount | undefined> {
    try {
      //@ts-expect-error not on type
      const result = await this.db.select().from(discounts).where(
        //@ts-expect-error not on type
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
