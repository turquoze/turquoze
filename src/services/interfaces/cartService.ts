import { Cart, CartItem, Shipping } from "../../utils/types.ts";

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

  ApplyCoupon(params: {
    id: string;
    coupon: string;
  }): Promise<Cart>;

  ApplyGiftcard(params: {
    id: string;
    giftcard: string;
  }): Promise<Cart>;

  UpsertComment(params: {
    id: string;
    comment: string;
  }): Promise<Cart>;

  RemoveCoupon(params: {
    id: string;
  }): Promise<Cart>;

  RemoveGiftcard(params: {
    id: string;
  }): Promise<Cart>;

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
