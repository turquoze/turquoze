import { and, eq, type PostgresJsDatabase } from "../deps.ts";
import { DatabaseError } from "../utils/errors.ts";

export default class DataService<T> {
  db: PostgresJsDatabase;
  // deno-lint-ignore no-explicit-any
  #table: any;
  // deno-lint-ignore no-explicit-any
  constructor(db: PostgresJsDatabase, table: any) {
    this.db = db;
    this.#table = table;
  }

  async Create(params: { data: object }): Promise<T> {
    try {
      const result = await this.db.insert(this.#table).values(params.data)
        .returning();

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Get(params: {
    id: string;
  }): Promise<T> {
    try {
      const result = await this.db.select().from(this.#table).where(
        and(
          eq(this.#table.deleted, false),
          eq(this.#table.publicId, params.id),
        ),
      ).limit(1) as Array<T>;

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetMany(params: {
    offset?: number | undefined;
    limit?: number | undefined;
    shop: string;
  }): Promise<Array<T>> {
    try {
      if (params.limit == undefined) {
        params.limit = 10;
      }

      if (params.offset == undefined) {
        params.offset = 0;
      }

      const result = await this.db.select().from(this.#table).where(
        and(
          eq(this.#table.deleted, false),
          eq(this.#table.shop, params.shop),
        ),
      ).limit(params.limit).offset(params.offset) as Array<T>;

      return result;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Update(params: { data: object; id: string }): Promise<T> {
    try {
      const result = await this.db.update(this.#table)
        .set(params.data)
        .where(eq(this.#table.publicId, params.id))
        .returning();

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Delete(params: {
    id: string;
  }) {
    try {
      await this.db.update(this.#table).set({
        deleted: true,
      }).where(
        eq(this.#table.publicId, params.id),
      );
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
