import { Product, Search } from "../../utils/types.ts";

export default interface ISearchService {
  ProductSearch(params: {
    data: Search;
  }): Promise<Array<Product>>;
}
