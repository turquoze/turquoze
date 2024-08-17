import ICartService from "../interfaces/cartService.ts";
import { Shipping } from "../../utils/types.ts";
import { DatabaseError } from "../../utils/errors.ts";
import { cartitems, carts } from "../../utils/schema.ts";
import {
  DBCart as Cart,
  DBCartItem as CartItem,
  Discount,
} from "../../utils/validator.ts";
import { and, eq, type PostgresJsDatabase } from "../../deps.ts";

export default class CartService implements ICartService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Create(_params: { data: Cart }): Promise<Cart> {
    try {
      //@ts-ignore not on type
      const result = await this.db.insert(carts).values({
        comment: "",
      }).returning();

      //@ts-ignore not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async AddItem(params: { data: CartItem }): Promise<CartItem> {
    try {
      //@ts-expect-error not on type
      const hasItem = await this.db.select().from(cartitems).where(
        and(
          //@ts-expect-error not on type
          eq(cartitems.cartId, params.data.cartId),
          //@ts-expect-error not on type
          eq(cartitems.itemId, params.data.itemId!),
        ),
      );

      if (hasItem.length > 0) {
        //@ts-expect-error not on type
        const result = await this.db.update(cartitems).set({
          price: params.data.price,
          //@ts-expect-error not on type
          quantity: (params.data.quantity ?? 0) + hasItem[0].quantity,
          //@ts-expect-error not on type
        }).where(eq(cartitems.id, hasItem[0].id)).returning();

        return result[0];
      } else {
        //@ts-ignore not on type
        const result = await this.db.insert(cartitems).values({
          cartId: params.data.cartId,
          itemId: params.data.itemId,
          price: params.data.price,
          quantity: params.data.quantity,
        });

        return result[0];
      }
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async AddMetadata(
    params: { id: string; metadata: Record<string, unknown> },
  ): Promise<Cart> {
    try {
      //@ts-expect-error not on type
      const result = await this.db.update(carts).set({
        metadata: params.metadata,
        //@ts-expect-error not on type
      }).where(eq(carts.publicId, params.id))
        .returning();

      //@ts-ignore not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async AddShipping(params: { id: string; shipping: Shipping }): Promise<Cart> {
    try {
      //@ts-expect-error not on type
      const result = await this.db.update(carts).set({
        shipping: params.shipping,
        //@ts-expect-error not on type
      }).where(eq(carts.publicId, params.id))
        .returning();

      //@ts-ignore not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async AddBilling(params: { id: string; billing: Shipping }): Promise<Cart> {
    try {
      //@ts-expect-error not on type
      const result = await this.db.update(carts).set({
        billing: params.billing,
        //@ts-expect-error not on type
      }).where(eq(carts.publicId, params.id)).returning();

      //@ts-ignore not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async UpdateShipping(
    params: { id: string; shipping: Shipping },
  ): Promise<Cart> {
    try {
      //@ts-expect-error not on type
      const result = await this.db.update(carts).set({
        shipping: params.shipping,
        //@ts-expect-error not on type
      }).where(eq(carts.publicId, params.id))
        .returning();

      //@ts-ignore not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async UpdateBilling(
    params: { id: string; billing: Shipping },
  ): Promise<Cart> {
    try {
      //@ts-expect-error not on type
      const result = await this.db.update(carts).set({
        billing: params.billing,
        //@ts-expect-error not on type
      }).where(eq(carts.publicId, params.id))
        .returning();

      //@ts-ignore not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async ApplyDiscount(
    params: { id: string; discount: Discount },
  ): Promise<CartItem> {
    try {
      //@ts-ignore not on type
      const result = await this.db.insert(cartitems).values({
        cartId: params.id,
        itemId: params.discount.publicId,
        price: 0,
        quantity: 1,
        type: "DISCOUNT",
      }).returning();

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async RemoveDiscount(
    params: { id: string; discountId: string },
  ): Promise<void> {
    try {
      //@ts-expect-error not on type
      await this.db.delete(cartitems).where(
        and(
          //@ts-expect-error not on type
          eq(cartitems.cartId, params.id),
          //@ts-expect-error not on type
          eq(cartitems.itemId, params.discountId),
          //@ts-expect-error not on type
          eq(cartitems.type, "DISCOUNT"),
        ),
      );
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async UpsertComment(params: { id: string; comment: string }): Promise<Cart> {
    try {
      //@ts-ignore not on type
      const result = await this.db.insert(carts).values({
        comment: params.comment,
      }).returning();

      //@ts-ignore not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async RemoveComment(params: { id: string }): Promise<Cart> {
    try {
      //@ts-expect-error not on type
      const result = await this.db.update(carts).set({
        comment: "",
        //@ts-expect-error not on type
      }).where(eq(carts.publicId, params.id))
        .returning();

      //@ts-ignore not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetCartItem(cartId: string, productId: string): Promise<CartItem> {
    try {
      //@ts-expect-error not on type
      const result = await this.db.select().from(cartitems).where(
        and(
          //@ts-expect-error not on type
          eq(cartitems.cartId, cartId),
          //@ts-expect-error not on type
          eq(cartitems.itemId, productId),
        ),
      );

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetAllItems(cartId: string): Promise<CartItem[]> {
    try {
      //@ts-expect-error not on type
      const result = await this.db.select().from(cartitems).where(
        //@ts-expect-error not on type
        eq(cartitems.cartId, cartId),
      );

      return result;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async RemoveItem(cartId: string, productId: string): Promise<void> {
    try {
      //@ts-expect-error not on type
      await this.db.delete(cartitems).where(
        and(
          //@ts-expect-error not on type
          eq(cartitems.cartId, cartId),
          //@ts-expect-error not on type
          eq(cartitems.itemId, productId),
        ),
      );
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Get(params: { id: string }): Promise<Cart> {
    try {
      //@ts-expect-error not on type
      const result = await this.db.select().from(carts).where(
        //@ts-expect-error not on type
        eq(carts.publicId, params.id),
      );
      //@ts-ignore not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Delete(params: { id: string }): Promise<void> {
    try {
      //@ts-expect-error not on type
      await this.db.delete(carts).where(eq(carts.publicId, params.id));
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
