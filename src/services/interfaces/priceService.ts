import { Price } from "../../utils/types.ts";

export default interface IPriceService {
  Create(params: {
    data: Price;
  }): Promise<Price>;

  Get(params: {
    id: string;
  }): Promise<Price>;

  GetByProduct(params: {
    productId: string;
  }): Promise<Price>;

  GetMany(params: {
    offset?: string;
    limit?: number;
  }): Promise<Array<Price>>;

  Update(params: {
    data: Price;
  }): Promise<Price>;

  Delete(params: {
    id: string;
  }): Promise<void>;
}
