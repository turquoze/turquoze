import ITaxService from "../interfaces/taxService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import { taxes } from "../../utils/schema.ts";
import { and, eq, type PostgresJsDatabase } from "../../deps.ts";
import { Tax } from "../../utils/validator.ts";

export default class TaxService implements ITaxService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Create(params: { data: Tax }): Promise<Tax> {
    try {
      //@ts-ignore not on type
      const result = await this.db.insert(taxes).values({
        name: params.data.name,
        type: params.data.type,
        value: params.data.value,
        shop: params.data.shop,
      }).returning();

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Get(params: { id: string }): Promise<Tax> {
    try {
      //@ts-expect-error not on type
      const result = await this.db.select().from(taxes).where(
        and(
          //@ts-expect-error not on type
          eq(taxes.deleted, false),
          //@ts-expect-error not on type
          eq(taxes.publicId, params.id),
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
  ): Promise<Tax[]> {
    try {
      if (params.limit == undefined) {
        params.limit = 10;
      }

      if (params.offset == undefined) {
        params.offset = 0;
      }

      //@ts-expect-error not on type
      const result = await this.db.select().from(taxes).where(
        and(
          //@ts-expect-error not on type
          eq(taxes.deleted, false),
          //@ts-expect-error not on type
          eq(taxes.shop, params.shop),
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
      await this.db.update(taxes).set({
        deleted: true,
        //@ts-expect-error not on type
      }).where(eq(taxes.publicId, params.id));
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
