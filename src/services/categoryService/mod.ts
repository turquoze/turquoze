import { Category } from "../../utils/types.ts";
import ICategoryService from "../interfaces/categoryService.ts";
import type postgresClient from "../dataClient/client.ts";
import { DatabaseError } from "../../utils/errors.ts";

export default class CategoryService implements ICategoryService {
  client: typeof postgresClient;
  constructor(client: typeof postgresClient) {
    this.client = client;
  }

  async Create(params: { data: Category }): Promise<Category> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Category>({
        text:
          "INSERT INTO categories (name, parent, region) VALUES ($1, $2, $3) RETURNING id",
        args: [params.data.name, params.data.parent, params.data.region],
      });

      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }

  async Get(params: { id: string }): Promise<Category> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Category>({
        text: "SELECT * FROM categories WHERE id = $1 LIMIT 1",
        args: [params.id],
      });

      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }

  async GetMany(
    params: { offset?: string; limit?: number },
  ): Promise<Array<Category>> {
    try {
      await this.client.connect();

      if (params.limit == null) {
        params.limit = 10;
      }
      const result = await this.client.queryObject<Category>({
        text: "SELECT * FROM categories LIMIT $1 OFFSET $2",
        args: [params.limit, params.offset],
      });

      return result.rows;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }

  async Update(params: { data: Category }): Promise<Category> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Category>({
        text:
          "UPDATE categories SET name = $1, parent = $2 WHERE id = $3 RETURNING id",
        args: [params.data.name, params.data.parent, params.data.id],
      });

      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }

  async Delete(params: { id: string }): Promise<void> {
    try {
      await this.client.connect();

      await this.client.queryObject<Category>({
        text: "DELETE FROM categories WHERE id = $1",
        args: [params.id],
      });
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }
}
