import type postgresClient from "../dataClient/client.ts";
import ISearchService from "../interfaces/searchService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import { Product, Search } from "../../utils/types.ts";
import ICacheService from "../interfaces/cacheService.ts";

export default class SearchService implements ISearchService {
  client: typeof postgresClient;
  cache: ICacheService;
  constructor(client: typeof postgresClient, cache: ICacheService) {
    this.client = client;
    this.cache = cache;
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

      const cacheResult = await this.cache.get(
        `productSearch-${params.data.query}-${params.data.region}-${params.data.limit}-${params.data.after}`,
      );

      if (cacheResult != null) {
        // @ts-expect-error wrong type
        return cacheResult.products;
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

      await this.cache.set({
        id:
          `productSearch-${params.data.query}-${params.data.region}-${params.data.limit}-${params.data.after}`,
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
}
