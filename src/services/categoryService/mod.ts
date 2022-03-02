import { Category } from "../../utils/types.ts";
import ICategoryService from "../interfaces/categoryService.ts";
import client from "../dataClient/client.ts";
import type postgresClient from "../dataClient/client.ts";

export default class CategoryService implements ICategoryService {
  client: typeof postgresClient;
  constructor() {
    this.client = client;
  }

  async Create(params: { data: Category }): Promise<Category> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Category>({
        text: "INSERT INTO categories (name, parent) VALUES ($1, $2)",
        args: [params.data.name, params.data.parent],
      });

      return result.rows[0];
    } catch (error) {
      throw new Error("DB error", {
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
      throw new Error("DB error", {
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
      throw new Error("DB error", {
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
          "UPDATE categories WHERE SET name = $1, parent = $2 WHERE pid = $3",
        args: [params.data.name, params.data.parent, params.data.id],
      });

      return result.rows[0];
    } catch (error) {
      throw new Error("DB error", {
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
      throw new Error("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }
}
