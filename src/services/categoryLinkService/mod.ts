import { CategoryLink, Product } from "../../utils/types.ts";
import ICategoryLinkService from "../interfaces/categoryLinkService.ts";
import type postgresClient from "../dataClient/client.ts";
import { DatabaseError } from "../../utils/errors.ts";
import ICacheService from "../interfaces/cacheService.ts";

export default class CategoryLinkService implements ICategoryLinkService {
  client: typeof postgresClient;
  cache: ICacheService;
  constructor(client: typeof postgresClient, cache: ICacheService) {
    this.client = client;
    this.cache = cache;
  }

  async Link(params: { data: CategoryLink }): Promise<CategoryLink> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<CategoryLink>({
        text: "INSERT INTO categorieslink (category, product) VALUES ($1, $2)",
        args: [params.data.category, params.data.product],
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

  async GetProducts(
    params: {
      id: string;
      offset?: string | undefined;
      limit?: number | undefined;
    },
  ): Promise<Product[]> {
    try {
      const cacheResult = await this.cache.get(params.id);

      if (cacheResult != null) {
        // @ts-expect-error wrong type
        return cacheResult.products;
      }

      await this.client.connect();

      if (params.limit == null) {
        params.limit = 10;
      }

      const result = await this.client.queryObject<Product>({
        text:
          "SELECT products.* FROM categorieslink RIGHT JOIN products ON categorieslink.product = products.id WHERE categorieslink.category = $1 LIMIT $2 OFFSET $3",
        args: [params.id, params.limit, params.offset],
      });

      await this.cache.set({
        id: params.id,
        data: { products: result.rows },
        expire: Date.now() + (60000 * 10),
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

  async Delete(params: { data: CategoryLink }): Promise<void> {
    try {
      await this.client.connect();

      await this.client.queryObject<CategoryLink>({
        text:
          "DELETE FROM categorieslink WHERE (category = $1 AND product = $2)",
        args: [params.data.category, params.data.product],
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
