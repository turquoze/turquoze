import ICategoryLinkService from "../interfaces/categoryLinkService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { categorieslink, CategoryLink, Product } from "../../utils/schema.ts";
import { and, eq, sql } from "drizzle-orm";

export default class CategoryLinkService implements ICategoryLinkService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Link(params: { data: CategoryLink }): Promise<CategoryLink> {
    try {
      const result = await this.db.insert(categorieslink).values({
        category: params.data.category,
        product: params.data.product,
      }).returning();

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetProducts(
    params: {
      id: string;
      offset?: number | undefined;
      limit?: number | undefined;
    },
  ): Promise<Product[]> {
    try {
      if (params.limit == undefined) {
        params.limit = 10;
      }

      if (params.offset == undefined) {
        params.offset = 0;
      }

      const result = await this.db.execute(
        sql`SELECT products.* FROM categorieslink RIGHT JOIN products ON categorieslink.product = products.public_id WHERE categorieslink.category = ${params.id} LIMIT ${params.limit} OFFSET ${params.offset}`,
      );

      //@ts-ignore not on type
      return result;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Delete(params: { data: CategoryLink }): Promise<void> {
    try {
      await this.db.delete(categorieslink).where(
        and(
          eq(categorieslink.category, params.data.category),
          eq(categorieslink.product, params.data.product),
        ),
      );
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
