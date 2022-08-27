import { Category } from "../../utils/types.ts";
import ICategoryService from "../interfaces/categoryService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { Pool } from "../../deps.ts";

export default class CategoryService implements ICategoryService {
  pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  async Create(params: { data: Category }): Promise<Category> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Category>({
        text:
          "INSERT INTO categories (name, parent, shop) VALUES ($1, $2, $3) RETURNING public_id",
        args: [params.data.name, params.data.parent, params.data.shop],
      });

      client.release();
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Get(params: { id: string }): Promise<Category> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Category>({
        text: "SELECT * FROM categories WHERE public_id = $1 LIMIT 1",
        args: [params.id],
      });

      client.release();
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetByName(params: { name: string }): Promise<Category> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Category>({
        text: "SELECT * FROM categories WHERE name = $1 LIMIT 1",
        args: [params.name],
      });

      client.release();
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetMany(
    params: { offset?: string; limit?: number },
  ): Promise<Array<Category>> {
    try {
      if (params.limit == null) {
        params.limit = 10;
      }

      const client = await this.pool.connect();

      const result = await client.queryObject<Category>({
        text: "SELECT * FROM categories LIMIT $1 OFFSET $2",
        args: [params.limit, params.offset],
      });

      client.release();
      return result.rows;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Update(params: { data: Category }): Promise<Category> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Category>({
        text:
          "UPDATE categories SET name = $1, parent = $2 WHERE public_id = $3 RETURNING public_id",
        args: [params.data.name, params.data.parent, params.data.public_id],
      });

      client.release();
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Delete(params: { id: string }): Promise<void> {
    try {
      const client = await this.pool.connect();

      await client.queryObject<Category>({
        text: "DELETE FROM categories WHERE public_id = $1",
        args: [params.id],
      });

      client.release();
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
