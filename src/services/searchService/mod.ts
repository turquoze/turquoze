import ISearchService from "../interfaces/searchService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import { Product, Search } from "../../utils/types.ts";
import { MeiliSearch } from "../../deps.ts";
import { MEILIAPIKEY, MEILIHOST, MEILIINDEX } from "../../utils/secrets.ts";

export default class SearchService implements ISearchService {
  async ProductSearch(
    params: {
      data: Search;
    },
  ): Promise<Product[]> {
    try {
      if (params.data.limit == null) {
        params.data.limit = 10;
      }

      const client = new MeiliSearch({ host: MEILIHOST!, apiKey: MEILIAPIKEY });

      const response = await client.index(MEILIINDEX!).search<Product>(
        params.data.query,
        {
          limit: params.data.limit ?? 20,
          offset: params.data.offset ?? 0,
        },
      );

      return response.hits;
    } catch (error) {
      throw new DatabaseError("Search error", {
        cause: error,
      });
    }
  }
}
