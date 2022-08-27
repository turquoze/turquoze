import { CategoryLink, Product } from "../../utils/types.ts";
import ICategoryLinkService from "../interfaces/categoryLinkService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { Pool } from "../../deps.ts";

export default class CategoryLinkService implements ICategoryLinkService {
  pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  async Link(params: { data: CategoryLink }): Promise<CategoryLink> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<CategoryLink>({
        text: "INSERT INTO categorieslink (category, product) VALUES ($1, $2)",
        args: [params.data.category, params.data.product],
      });

      client.release();
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetProducts(
    params: {
      id: string;
      offset?: string | undefined;
      limit?: number | undefined;
    },
  ): Promise<Product[]> {
    try {
      const client = await this.pool.connect();

      if (params.limit == null) {
        params.limit = 10;
      }

      const result = await client.queryObject<Product>({
        text:
          "SELECT products.* FROM categorieslink RIGHT JOIN products ON categorieslink.product = products.id WHERE categorieslink.category = $1 LIMIT $2 OFFSET $3",
        args: [params.id, params.limit, params.offset],
      });

      client.release();
      return result.rows;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Delete(params: { data: CategoryLink }): Promise<void> {
    try {
      const client = await this.pool.connect();

      await client.queryObject<CategoryLink>({
        text:
          "DELETE FROM categorieslink WHERE (category = $1 AND product = $2)",
        args: [params.data.category, params.data.product],
      });

      client.release();
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
