import { Cart } from "../../utils/types.ts";

export default interface ICartService {
  CreateOrUpdate(params: {
    data: Cart;
  }): Promise<Cart>;

  Get(params: {
    id: string;
  }): Promise<Cart>;

  Delete(params: {
    id: string;
  }): Promise<void>;
}
