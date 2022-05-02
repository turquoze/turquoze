import type postgresClient from "../dataClient/client.ts";
import ISearchService from "../interfaces/searchService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import { Product, Search } from "../../utils/types.ts";

export default class SearchService implements ISearchService {
  client: typeof postgresClient;
  constructor(client: typeof postgresClient) {
    this.client = client;
  }

  async ProductSearch(
    params: {
      data: Search;
    },
  ): Promise<Product[]> {
    try {
      if (params.data.limit == null) {
        params.data.limit = 10;
      }

      await this.client.connect();

      const result = await this.client.queryObject<Product>({
        text:
          "SELECT * FROM products WHERE to_tsvector(description || ' ' || title) @@ to_tsquery($1) AND region = $2 LIMIT $3 OFFSET $4",
        args: [
          params.data.query,
          params.data.region,
          params.data.limit,
          params.data.after,
        ],
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
