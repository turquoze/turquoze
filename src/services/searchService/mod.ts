import ISearchService from "../interfaces/searchService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import { MeiliDelete, MeiliIndex, Product, Search } from "../../utils/types.ts";
import { EnqueuedTask, MeiliSearch, SearchResponse } from "../../deps.ts";

export default class SearchService implements ISearchService {
  #client?: MeiliSearch;
  constructor(client?: MeiliSearch) {
    this.#client = client;
  }

  async ProductSearch(
    params: Search,
    client?: MeiliSearch | undefined,
  ): Promise<SearchResponse<Product>> {
    try {
      let localClient = this.#client;
      if (this.#client == undefined) {
        localClient = client;
      }
      if (localClient == undefined) {
        throw new Error("No client connection");
      }

      const response = await localClient!.index(params.index).search<Product>(
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
    client?: MeiliSearch | undefined,
  ): Promise<EnqueuedTask> {
    try {
      let localClient = this.#client;
      if (this.#client == undefined) {
        localClient = client;
      }
      if (localClient == undefined) {
        throw new Error("No client connection");
      }

      const task = await localClient!.index<Product>(params.index).addDocuments(
        params.products,
      );
      return task;
    } catch (error) {
      throw new DatabaseError("Index Add error", {
        cause: error,
      });
    }
  }

  async ProductRemove(
    params: MeiliDelete,
    client?: MeiliSearch | undefined,
  ): Promise<EnqueuedTask> {
    try {
      let localClient = this.#client;
      if (this.#client == undefined) {
        localClient = client;
      }
      if (localClient == undefined) {
        throw new Error("No client connection");
      }

      const task = await localClient!.index<Product>(params.index)
        .deleteDocument(params.id);
      return task;
    } catch (error) {
      throw new DatabaseError("Index delete error", {
        cause: error,
      });
    }
  }
}
