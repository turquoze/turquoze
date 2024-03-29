import { Price } from "../../utils/validator.ts";

export default interface IPriceService {
  Create(params: {
    data: Price;
  }): Promise<Price>;

  Get(params: {
    id: string;
  }): Promise<Price>;

  GetByProduct(params: {
    productId: string;
    list?: string;
  }): Promise<Price>;

  GetManyByProduct(params: {
    productId: string;
  }): Promise<Array<Price>>;

  GetMany(params: {
    offset?: number;
    limit?: number;
    shop: string;
  }): Promise<Array<Price>>;

  Update(params: {
    data: Price;
  }): Promise<Price>;

  Delete(params: {
    id: string;
  }): Promise<void>;
}
