import { CategoryLink } from "../../utils/types.ts";
import ICategoryLinkService from "../interfaces/categoryLinkService.ts";
import client from "../dataClient/client.ts";
import type postgresClient from "../dataClient/client.ts";

export default class CategoryLinkService implements ICategoryLinkService {
  client: typeof postgresClient;
  constructor() {
    this.client = client;
  }

  async Link(params: { data: CategoryLink }): Promise<CategoryLink> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<CategoryLink>({
        text: "INSERT INTO categriesLink (category, product) VALUES ($1, $2)",
        args: [params.data.category, params.data.product],
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

  async Delete(params: { data: CategoryLink }): Promise<void> {
    try {
      await this.client.connect();

      await this.client.queryObject<CategoryLink>({
        text: "DELETE FROM categriesLink WHERE category = $1 AND product = $2",
        args: [params.data.category, params.data.product],
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
