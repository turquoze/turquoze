import { Cart } from "../../utils/types.ts";

export default interface ICartService {
  Create(params: {
    data: Cart;
  }): Promise<Cart>;

  Get(params: {
    id: string;
  }): Promise<Cart>;

  Update(params: {
    data: Cart;
  }): Promise<Cart>;
}
