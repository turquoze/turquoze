import { Product } from "../../utils/types.ts";

export default interface IProductService {
  Create(params: {
    data: Product;
  }): Promise<Product>;

  Get(params: {
    id: string;
  }): Promise<Product>;

  GetBySlug(params: {
    slug: string;
  }): Promise<Product>;

  GetVariantsByParent(params: {
    id: string;
  }): Promise<Array<Product>>;

  GetMany(params: {
    offset?: string;
    limit?: number;
    shop: string;
  }): Promise<Array<Product>>;

  Update(params: {
    data: Product;
  }): Promise<Product>;

  Delete(params: {
    id: string;
  }): Promise<void>;
}
