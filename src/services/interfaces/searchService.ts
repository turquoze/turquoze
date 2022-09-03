import type { EnqueuedTask, SearchResponse } from "../../deps.ts";
import { MeiliDelete, MeiliIndex, Product, Search } from "../../utils/types.ts";

export default interface ISearchService {
  ProductSearch(params: Search): Promise<SearchResponse<Product>>;
  ProductIndex(params: MeiliIndex): Promise<EnqueuedTask>;
  ProductRemove(params: MeiliDelete): Promise<EnqueuedTask>;
}
