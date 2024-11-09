import DataService from "./dataService.ts";
import { Tax, TaxProductLink } from "../utils/validator.ts";
import { taxeslink } from "../utils/schema.ts";
import { and, eq, PostgresJsDatabase, sql } from "../deps.ts";
import { DatabaseError } from "../utils/errors.ts";

export default class TaxLinkService extends DataService<TaxProductLink> {
  constructor(db: PostgresJsDatabase) {
    super(db, taxeslink);
  }

  override Get(_params: { id: string }): Promise<TaxProductLink> {
    throw Error("Not implemented");
  }

  override GetMany(
    _params: {
      offset?: number | undefined;
      limit?: number | undefined;
      shop: string;
    },
  ): Promise<TaxProductLink[]> {
    throw Error("Not implemented");
  }

  override Update(
    _params: { data: object; id: string },
  ): Promise<TaxProductLink> {
    throw Error("Not implemented");
  }

  override async Delete(
    params: { id: string; productId: string; countryId: string; taxId: string },
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

  async GetTaxByProduct(
    params: { productId: string; country: string },
  ): Promise<Tax> {
    try {
      const result = await this.db.execute(
        sql`SELECT taxes.* FROM taxeslink RIGHT JOIN taxes ON taxeslink.tax_id = taxes.public_id WHERE taxeslink.product_id = ${params.productId} AND taxeslink.country = ${params.country} LIMIT 1`,
      );

      const tax: Tax = {
        //@ts-ignore TS2578
        name: result[0].name,
        //@ts-ignore TS2578
        createdAt: result[0].created_at,
        //@ts-ignore TS2578
        publicId: result[0].public_id,
        //@ts-ignore TS2578
        value: result[0].value,
        //@ts-ignore TS2578
        shop: result[0].shop,
        //@ts-ignore TS2578
        type: result[0].type,
      };

      return tax;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
