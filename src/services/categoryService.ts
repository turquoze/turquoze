import DataService from "./dataService.ts";
import { Category } from "../utils/validator.ts";
import { categories } from "../utils/schema.ts";
import { and, eq, PostgresJsDatabase } from "../deps.ts";
import { DatabaseError } from "../utils/errors.ts";

export default class CategoryService extends DataService<Category> {
  constructor(db: PostgresJsDatabase) {
    super(db, categories);
  }

  async GetByName(params: { name: string; shop: string }): Promise<Category> {
    try {
      const result = await this.db.select().from(categories).where(
        and(
          eq(categories.deleted, false),
          eq(categories.shop, params.shop),
          eq(categories.name, params.name),
        ),
      );

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
