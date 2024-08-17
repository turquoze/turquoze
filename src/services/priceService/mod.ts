import IPriceService from "../interfaces/priceService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import { prices } from "../../utils/schema.ts";
import { and, eq, type PostgresJsDatabase } from "../../deps.ts";
import { Price } from "../../utils/validator.ts";

export default class PriceService implements IPriceService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Create(params: { data: Price }): Promise<Price> {
    try {
      //@ts-ignore not on type
      const result = await this.db.insert(prices).values({
        amount: params.data.amount,
        shop: params.data.shop,
        product: params.data.product,
      }).returning();

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Get(params: { id: string }): Promise<Price> {
    try {
      //@ts-expect-error not on type
      const result = await this.db.select().from(prices).where(
        and(
          //@ts-expect-error not on type
          eq(prices.deleted, false),
          //@ts-expect-error not on type
          eq(prices.publicId, params.id),
        ),
      );

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetByProduct(
    params: { productId: string; list?: string },
  ): Promise<Price> {
    try {
      if (params.list == undefined) {
        params.list = "Default";
      }
      //@ts-expect-error not on type
      const result = await this.db.select().from(prices).where(
        and(
          //@ts-expect-error not on type
          eq(prices.deleted, false),
          //@ts-expect-error not on type
          eq(prices.product, params.productId),
          //@ts-expect-error not on type
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

      //@ts-expect-error not on type
      const result = await this.db.select().from(prices).where(
        and(
          //@ts-expect-error not on type
          eq(prices.deleted, false),
          //@ts-expect-error not on type
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

  async GetMany(
    params: { offset?: number; limit?: number; shop: string },
  ): Promise<Array<Price>> {
    try {
      if (params.limit == undefined) {
        params.limit = 10;
      }

      if (params.offset == undefined) {
        params.offset = 0;
      }

      //@ts-expect-error not on type
      const result = await this.db.select().from(prices).where(
        and(
          //@ts-expect-error not on type
          eq(prices.deleted, false),
          //@ts-expect-error not on type
          eq(prices.shop, params.shop),
        ),
      ).limit(params.limit).offset(params.offset);

      return result;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Update(params: { data: Price }): Promise<Price> {
    try {
      //@ts-expect-error not on type
      const result = await this.db.update(prices)
        .set({
          amount: params.data.amount,
        })
        //@ts-expect-error not on type
        .where(eq(prices.publicId, params.data.publicId!))
        .returning();

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Delete(params: { id: string }): Promise<void> {
    try {
      //@ts-expect-error not on type
      await this.db.update(prices).set({
        deleted: true,
        //@ts-expect-error not on type
      }).where(eq(prices.publicId, params.id));
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
