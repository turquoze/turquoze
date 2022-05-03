import { CategoryLink, Product } from "../../utils/types.ts";
import ICategoryLinkService from "../interfaces/categoryLinkService.ts";
import type postgresClient from "../dataClient/client.ts";
import { DatabaseError } from "../../utils/errors.ts";

export default class CategoryLinkService implements ICategoryLinkService {
  client: typeof postgresClient;
  constructor(client: typeof postgresClient) {
    this.client = client;
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
      await this.client.connect();

      if (params.limit == null) {
        params.limit = 10;
      }

      const result = await this.client.queryObject<Product>({
        text:
          "SELECT products.* FROM categorieslink RIGHT JOIN products ON categorieslink.product = products.id WHERE categorieslink.category = $1 LIMIT $2 OFFSET $3",
        args: [params.id, params.limit, params.offset],
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
