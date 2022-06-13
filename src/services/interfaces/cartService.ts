import { Cart, CartItem } from "../../utils/types.ts";

export default interface ICartService {
  Create(params: {
    data: Cart;
  }): Promise<Cart>;

  AddItem(params: {
    data: CartItem;
  }): Promise<CartItem>;

  GetCartItem(cartId: string, productId: string): Promise<CartItem>;

  GetAllItems(cartId: string): Promise<Array<CartItem>>;

  RemoveItem(cartId: string, productId: string): Promise<void>;

  Get(params: {
    id: string;
  }): Promise<Cart>;

  Delete(params: {
    id: string;
  }): Promise<void>;
}
