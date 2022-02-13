import { Product } from "../../utils/types.ts";

export default interface IProductService {
  Create(params: {
    data: Product;
  }): Promise<Product>;

  Get(params: {
    id: string;
  }): Promise<Product>;

  GetMany(params: {
    offset?: string;
    limit?: number;
  }): Promise<Array<Product>>;

  Update(params: {
    data: Product;
  }): Promise<Product>;

  Delete(params: {
    id: string;
  }): Promise<void>;
}
