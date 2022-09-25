import ICartService from "../interfaces/cartService.ts";
import { Cart, CartItem, Shipping } from "../../utils/types.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { Pool } from "../../deps.ts";

export default class CartService implements ICartService {
  pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  async Create(_params: { data: Cart }): Promise<Cart> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Cart>({
        text: "INSERT INTO carts DEFAULT VALUES RETURNING public_id",
      });

      client.release();
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async AddItem(params: { data: CartItem }): Promise<CartItem> {
    try {
      const client = await this.pool.connect();

      const hasItem = await client.queryObject<CartItem>({
        text:
          "SELECT * FROM cartitems WHERE cart_id = $1 AND product_id = $2 LIMIT 1",
        args: [params.data.cart_id, params.data.product_id],
      });

      if (hasItem.rows.length > 0) {
        const result = await client.queryObject<CartItem>({
          text:
            "UPDATE cartitems SET price = $1, quantity = $2 WHERE id = $3 RETURNING id",
          args: [
            params.data.price,
            params.data.quantity + hasItem.rows[0].quantity,
            hasItem.rows[0].id,
          ],
        });

        return result.rows[0];
      } else {
        const result = await client.queryObject<CartItem>({
          text:
            "INSERT INTO cartitems (cart_id, product_id, price, quantity) VALUES ($1, $2, $3, $4) RETURNING id",
          args: [
            params.data.cart_id,
            params.data.product_id,
            params.data.price,
            params.data.quantity,
          ],
        });

        client.release();
        return result.rows[0];
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
      const client = await this.pool.connect();

      const result = await client.queryObject<Cart>({
        text:
          "INSERT INTO cart (metadata) VALUES ($1) WHERE public_id = $2 RETURNING id",
        args: [
          params.metadata,
          params.id,
        ],
      });

      client.release();
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async AddShipping(params: { id: string; shipping: Shipping }): Promise<Cart> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Cart>({
        text:
          "INSERT INTO cart (shipping) VALUES ($1) WHERE public_id = $2 RETURNING id",
        args: [
          params.shipping,
          params.id,
        ],
      });

      client.release();
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async AddBilling(params: { id: string; billing: Shipping }): Promise<Cart> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Cart>({
        text:
          "INSERT INTO cart (billing) VALUES ($1) WHERE public_id = $2 RETURNING id",
        args: [
          params.billing,
          params.id,
        ],
      });

      client.release();
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetCartItem(cartId: string, productId: string): Promise<CartItem> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<CartItem>({
        text:
          "SELECT * FROM cartitems WHERE cart_id = $1 AND product_id = $2 LIMIT 1",
        args: [cartId, productId],
      });

      client.release();
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetAllItems(cartId: string): Promise<CartItem[]> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<CartItem>({
        text: "SELECT * FROM cartitems WHERE cart_id = $1",
        args: [cartId],
      });

      client.release();
      return result.rows;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async RemoveItem(cartId: string, productId: string): Promise<void> {
    try {
      const client = await this.pool.connect();

      await client.queryObject<CartItem>({
        text: "DELETE FROM cartitems WHERE cart_id = $1 AND product_id = $2",
        args: [cartId, productId],
      });

      client.release();
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Get(params: { id: string }): Promise<Cart> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Cart>({
        text: "SELECT * FROM carts WHERE public_id = $1 LIMIT 1",
        args: [params.id],
      });

      client.release();
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Delete(params: { id: string }): Promise<void> {
    try {
      const client = await this.pool.connect();

      await client.queryObject<Cart>({
        text: "DELETE FROM carts WHERE public_id = $1",
        args: [params.id],
      });
      client.release();
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
