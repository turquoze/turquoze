import DataService from "./dataService.ts";
import { Product } from "../utils/validator.ts";
import { products } from "../utils/schema.ts";
import { and, eq, PostgresJsDatabase } from "../deps.ts";
import { DatabaseError } from "../utils/errors.ts";

export default class ProductService extends DataService<Product> {
  constructor(db: PostgresJsDatabase) {
    super(db, products);
  }

  async GetBySlug(params: { slug: string }): Promise<Product> {
    try {
      const result = await this.db.select().from(products).where(
        and(
          eq(products.deleted, false),
          eq(products.slug, params.slug),
        ),
      );
      //@ts-ignore not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetVariantsByParent(params: { id: string }): Promise<Product[]> {
    try {
      const result = await this.db.select().from(products).where(
        and(
          eq(products.deleted, false),
          eq(products.parent, params.id),
        ),
      );
      //@ts-ignore not on type
      return result;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
