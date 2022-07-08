import type postgresClient from "../dataClient/client.ts";
import ICartService from "../interfaces/cartService.ts";
import { Cart, CartItem } from "../../utils/types.ts";
import { DatabaseError } from "../../utils/errors.ts";

export default class CartService implements ICartService {
  client: typeof postgresClient;
  constructor(client: typeof postgresClient) {
    this.client = client;
  }

  async Create(_params: { data: Cart }): Promise<Cart> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Cart>({
        text: "INSERT INTO carts DEFAULT VALUES RETURNING public_id",
      });

      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }

  async AddItem(params: { data: CartItem }): Promise<CartItem> {
    try {
      await this.client.connect();

      const hasItem = await this.client.queryObject<CartItem>({
        text:
          "SELECT * FROM cartitems WHERE cart_id = $1 AND product_id = $2 LIMIT 1",
        args: [params.data.cart_id, params.data.product_id],
      });

      if (hasItem.rows.length > 0) {
        const result = await this.client.queryObject<CartItem>({
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
        const result = await this.client.queryObject<CartItem>({
          text:
            "INSERT INTO cartitems (cart_id, product_id, price, quantity) VALUES ($1, $2, $3, $4) RETURNING id",
          args: [
            params.data.cart_id,
            params.data.product_id,
            params.data.price,
            params.data.quantity,
          ],
        });

        return result.rows[0];
      }
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }

  async GetCartItem(cartId: string, productId: string): Promise<CartItem> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<CartItem>({
        text:
          "SELECT * FROM cartitems WHERE cart_id = $1 AND product_id = $2 LIMIT 1",
        args: [cartId, productId],
      });

      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }

  async GetAllItems(cartId: string): Promise<CartItem[]> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<CartItem>({
        text: "SELECT * FROM cartitems WHERE cart_id = $1",
        args: [cartId],
      });

      return result.rows;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }

  async RemoveItem(cartId: string, productId: string): Promise<void> {
    try {
      await this.client.connect();

      await this.client.queryObject<CartItem>({
        text: "DELETE FROM cartitems WHERE cart_id = $1 AND product_id = $2",
        args: [cartId, productId],
      });
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }

  async Get(params: { id: string }): Promise<Cart> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Cart>({
        text: "SELECT * FROM carts WHERE public_id = $1 LIMIT 1",
        args: [params.id],
      });

      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }

  async Delete(params: { id: string }): Promise<void> {
    try {
      await this.client.connect();

      await this.client.queryObject<Cart>({
        text: "DELETE FROM carts WHERE public_id = $1",
        args: [params.id],
      });
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }
}
