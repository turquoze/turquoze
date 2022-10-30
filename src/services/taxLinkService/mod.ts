import { Tax, TaxProductLink } from "../../utils/types.ts";
import ITaxLinkService from "../interfaces/taxLinkService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { Pool } from "../../deps.ts";

export default class TaxLinkService implements ITaxLinkService {
  pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  async Create(params: { data: TaxProductLink }): Promise<TaxProductLink> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<TaxProductLink>({
        text:
          "INSERT INTO taxeslink (product_id, tax_id, country) VALUES ($1, $2, $3)",
        args: [params.data.product_id, params.data.tax_id, params.data.country],
      });

      client.release();
      return result.rows[0];
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
      const client = await this.pool.connect();

      const result = await client.queryObject<Tax>({
        text:
          "SELECT taxes.* FROM taxeslink RIGHT JOIN taxes ON taxeslink.tax_id = taxes.public_id WHERE taxeslink.product_id = $1 AND taxeslink.country = $2 LIMIT 1",
        args: [params.productId, params.country],
      });

      client.release();
      return result.rows[0];
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
      const client = await this.pool.connect();

      await client.queryObject<TaxProductLink>({
        text:
          "DELETE FROM taxeslink WHERE (product_id = $1 AND tax_id = $2 AND country = $3)",
        args: [params.productId, params.taxId, params.countryId],
      });

      client.release();
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
