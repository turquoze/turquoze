import ISearchService from "../interfaces/searchService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import { Product, Search } from "../../utils/types.ts";
import { MeiliSearch, SearchResponse } from "../../deps.ts";
import { MEILIAPIKEY, MEILIHOST, MEILIINDEX } from "../../utils/secrets.ts";

export default class SearchService implements ISearchService {
  async ProductSearch(
    params: Search,
  ): Promise<SearchResponse<Product>> {
    try {
      const client = new MeiliSearch({ host: MEILIHOST!, apiKey: MEILIAPIKEY });

      const response = await client.index(MEILIINDEX!).search<Product>(
        params.query,
        params.options,
      );

      return response;
    } catch (error) {
      throw new DatabaseError("Search error", {
        cause: error,
      });
    }
  }
}
