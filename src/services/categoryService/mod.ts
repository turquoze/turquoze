import { Category } from "../../utils/types.ts";
import ICategoryService from "../interfaces/categoryService.ts";
import type postgresClient from "../dataClient/client.ts";
import { DatabaseError } from "../../utils/errors.ts";
import ICacheService from "../interfaces/cacheService.ts";
import { stringifyJSON } from "../../utils/utils.ts";

export default class CategoryService implements ICategoryService {
  client: typeof postgresClient;
  cache: ICacheService;
  constructor(client: typeof postgresClient, cache: ICacheService) {
    this.client = client;
    this.cache = cache;
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
      const cacheResult = await this.cache.get<Category>(params.id);

      if (cacheResult != null) {
        return cacheResult;
      }

      await this.client.connect();

      const result = await this.client.queryObject<Category>({
        text: "SELECT * FROM categories WHERE id = $1 LIMIT 1",
        args: [params.id],
      });

      await this.cache.set({
        id: params.id,
        data: stringifyJSON(result.rows[0]),
        expire: (60 * 60),
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
      if (params.limit == null) {
        params.limit = 10;
      }

      const cacheResult = await this.cache.get<Array<Category>>(
        `categoryGetMany-${params.limit}-${params.offset}`,
      );

      if (cacheResult != null) {
        return cacheResult;
      }

      await this.client.connect();

      const result = await this.client.queryObject<Category>({
        text: "SELECT * FROM categories LIMIT $1 OFFSET $2",
        args: [params.limit, params.offset],
      });

      await this.cache.set({
        id: `categoryGetMany-${params.limit}-${params.offset}`,
        data: stringifyJSON(result.rows),
        expire: (60 * 10),
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

      await this.cache.set({
        id: params.data.id,
        data: stringifyJSON(params.data),
        expire: (60 * 60),
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

      await this.cache.delete(params.id);
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }
}
