import type postgresClient from "../dataClient/client.ts";
import ICartService from "../interfaces/cartService.ts";
import { Cart } from "../../utils/types.ts";
import { DatabaseError } from "../../utils/errors.ts";

export default class CartService implements ICartService {
  client: typeof postgresClient;
  constructor(client: typeof postgresClient) {
    this.client = client;
  }

  async CreateOrUpdate(params: { data: Cart }): Promise<Cart> {
    try {
      await this.client.connect();

      let result;
      if (
        params.data.id == "" || params.data.id == undefined ||
        params.data.id == null
      ) {
        result = await this.client.queryObject<Cart>({
          text:
            "INSERT INTO carts (products, discounts) VALUES ($1, $2) RETURNING id",
          args: [params.data.products, params.data.discounts],
        });
      } else {
        result = await this.client.queryObject<Cart>({
          text:
            "UPDATE carts SET products = $1, discounts = $2 WHERE id = $3 RETURNING id",
          args: [params.data.products, params.data.discounts, params.data.id],
        });
      }

      return result.rows[0];
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
        text: "SELECT * FROM carts WHERE id = $1 LIMIT 1",
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
        text: "DELETE FROM carts WHERE id = $1",
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
