import type { EnqueuedTask, MeiliSearch, SearchResponse } from "../../deps.ts";
import { MeiliDelete, MeiliIndex, Product, Search } from "../../utils/types.ts";

export default interface ISearchService {
  ProductSearch(
    params: Search,
    client?: MeiliSearch,
  ): Promise<SearchResponse<Product>>;

  ProductIndex(params: MeiliIndex, client?: MeiliSearch): Promise<EnqueuedTask>;

  ProductRemove(
    params: MeiliDelete,
    client?: MeiliSearch,
  ): Promise<EnqueuedTask>;

  ProductFilterableAttributes(
    index: string,
    attributes: Array<string>,
    client?: MeiliSearch,
  ): Promise<EnqueuedTask>;
}
