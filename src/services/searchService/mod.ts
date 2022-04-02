import type postgresClient from "../dataClient/client.ts";
import ISearchService from "../interfaces/searchService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import { Product } from "../../utils/types.ts";

export default class SearchService implements ISearchService {
  client: typeof postgresClient;
  constructor(client: typeof postgresClient) {
    this.client = client;
  }

  async ProductSearch(
    params: {
      query: string;
      limit?: number | undefined;
      after?: string | undefined;
    },
  ): Promise<Product[]> {
    try {
      await this.client.connect();

      if (params.limit == null) {
        params.limit = 10;
      }
      const result = await this.client.queryObject<Product>({
        text:
          "SELECT * FROM products WHERE to_tsvector(description || ' ' || title) @@ to_tsquery($1) LIMIT $2 OFFSET $3",
        args: [params.query, params.limit, params.after],
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
}
