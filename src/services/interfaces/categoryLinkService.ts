import { CategoryLink, Product } from "../../utils/types.ts";

export default interface ICategoryLinkService {
  Link(params: {
    data: CategoryLink;
  }): Promise<CategoryLink>;

  Delete(params: {
    data: CategoryLink;
  }): Promise<void>;

  GetProducts(params: {
    id: string;
    offset?: string;
    limit?: number;
  }): Promise<Array<Product>>;
}
