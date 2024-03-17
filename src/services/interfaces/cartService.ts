import {
  DBCart as Cart,
  DBCartItem as CartItem,
  Discount,
} from "../../utils/validator.ts";
import { Shipping } from "../../utils/types.ts";

export default interface ICartService {
  Create(params: {
    data: Cart;
  }): Promise<Cart>;

  AddItem(params: {
    data: CartItem;
  }): Promise<CartItem>;

  AddMetadata(params: {
    id: string;
    metadata: Record<string, unknown>;
  }): Promise<Cart>;

  AddShipping(params: {
    id: string;
    shipping: Shipping;
  }): Promise<Cart>;

  AddBilling(params: {
    id: string;
    billing: Shipping;
  }): Promise<Cart>;

  UpdateShipping(params: {
    id: string;
    shipping: Shipping;
  }): Promise<Cart>;

  UpdateBilling(params: {
    id: string;
    billing: Shipping;
  }): Promise<Cart>;

  ApplyDiscount(params: {
    id: string;
    discount: Discount;
  }): Promise<CartItem>;

  UpsertComment(params: {
    id: string;
    comment: string;
  }): Promise<Cart>;

  RemoveDiscount(params: {
    id: string;
    discountId: string;
  }): Promise<void>;

  RemoveComment(params: {
    id: string;
  }): Promise<Cart>;

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
