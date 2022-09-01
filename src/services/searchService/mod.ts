import ISearchService from "../interfaces/searchService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import { MeiliIndex, Product, Search } from "../../utils/types.ts";
import { EnqueuedTask, MeiliSearch, SearchResponse } from "../../deps.ts";
import { MEILIINDEX } from "../../utils/secrets.ts";

export default class SearchService implements ISearchService {
  client: MeiliSearch;
  constructor(client: MeiliSearch) {
    this.client = client;
  }

  async ProductSearch(
    params: Search,
  ): Promise<SearchResponse<Product>> {
    try {
      const response = await this.client.index(MEILIINDEX!).search<Product>(
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

  async ProductIndex(
    params: MeiliIndex,
  ): Promise<EnqueuedTask> {
    try {
      const task = await this.client.index<Product>(params.index).addDocuments([
        params.product,
      ]);
      return task;
    } catch (error) {
      throw new DatabaseError("Search error", {
        cause: error,
      });
    }
  }
}
