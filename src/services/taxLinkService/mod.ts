import { Tax, TaxProductLink } from "../../utils/types.ts";
import ITaxLinkService from "../interfaces/taxLinkService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { taxeslink } from "../../utils/schema.ts";
import { and, eq, sql } from "drizzle-orm";

export default class TaxLinkService implements ITaxLinkService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Create(params: { data: TaxProductLink }): Promise<TaxProductLink> {
    try {
      // @ts-expect-error not on type
      const result = await this.db.insert(taxeslink).values({
        productId: params.data.productId,
        taxId: params.data.taxId,
        country: params.data.country,
      }).returning();

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetTaxByProduct(
    params: { productId: string; country: string },
  ): Promise<Tax> {
    try {
      const result = await this.db.execute(
        sql`SELECT taxes.* FROM taxeslink RIGHT JOIN taxes ON taxeslink.tax_id = taxes.public_id WHERE taxeslink.product_id = ${params.productId} AND taxeslink.country = ${params.country} LIMIT 1`,
      );

      //@ts-expect-error not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Delete(
    params: { productId: string; countryId: string; taxId: string },
  ): Promise<void> {
    try {
      await this.db.delete(taxeslink).where(
        and(
          eq(taxeslink.productId, params.productId),
          eq(taxeslink.taxId, params.taxId),
          eq(taxeslink.country, params.countryId),
        ),
      );
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
