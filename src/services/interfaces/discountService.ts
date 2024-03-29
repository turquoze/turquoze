import { Discount } from "../../utils/validator.ts";

export default interface IDiscountService {
  Create(params: {
    data: Discount;
  }): Promise<Discount>;

  Get(params: {
    id: string;
  }): Promise<Discount>;

  GetByCode(params: {
    code: string;
  }): Promise<Discount>;

  GetMany(params: {
    offset?: number;
    limit?: number;
    shop: string;
  }): Promise<Array<Discount>>;

  Delete(params: {
    id: string;
  }): Promise<void>;

  Validate(params: {
    code: string;
  }): Promise<Discount | undefined>;
}
