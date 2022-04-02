import { Product } from "../../utils/types.ts";

export default interface ISearchService {
  ProductSearch(params: {
    query: string;
    limit?: number;
    after?: string;
  }): Promise<Array<Product>>;
}
