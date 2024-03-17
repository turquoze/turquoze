import { CategoryLink, Product } from "../../utils/validator.ts";

export default interface ICategoryLinkService {
  Link(params: {
    data: CategoryLink;
  }): Promise<CategoryLink>;

  Delete(params: {
    data: CategoryLink;
  }): Promise<void>;

  GetProducts(params: {
    id: string;
    offset?: number;
    limit?: number;
  }): Promise<Array<Product>>;
}
