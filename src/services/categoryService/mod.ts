import ICategoryService from "../interfaces/categoryService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import { categories } from "../../utils/schema.ts";
import { and, eq, type PostgresJsDatabase } from "../../deps.ts";
import { Category } from "../../utils/validator.ts";

export default class CategoryService implements ICategoryService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Create(params: { data: Category }): Promise<Category> {
    try {
      //@ts-ignore not on type
      const result = await this.db.insert(categories).values({
        name: params.data.name,
        parent: params.data.parent,
        shop: params.data.shop,
      }).returning();

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Get(params: { id: string }): Promise<Category> {
    try {
      const result = await this.db.select().from(categories).where(
        and(
          eq(categories.deleted, false),
          eq(categories.publicId, params.id),
        ),
      );

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
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

  async GetMany(
    params: { offset?: number; limit?: number; shop: string },
  ): Promise<Array<Category>> {
    try {
      if (params.limit == undefined) {
        params.limit = 10;
      }

      if (params.offset == undefined) {
        params.offset = 0;
      }

      const result = await this.db.select().from(categories).where(
        and(
          eq(categories.deleted, false),
          eq(categories.shop, params.shop),
        ),
      ).limit(params.limit).offset(params.offset);

      return result;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Update(params: { data: Category }): Promise<Category> {
    try {
      const result = await this.db.update(categories)
        .set({
          name: params.data.name,
          parent: params.data.parent,
        })
        .where(eq(categories.publicId, params.data.publicId!))
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
      await this.db.update(categories).set({
        deleted: true,
      }).where(
        eq(categories.publicId, params.id),
      );
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
