import type postgresClient from "../dataClient/client.ts";
import ICartService from "../interfaces/cartService.ts";
import { Cart } from "../../utils/types.ts";

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
          text: "INSERT INTO carts (products) VALUES ($1)",
          args: [params.data.products],
        });
      } else {
        result = await this.client.queryObject<Cart>({
          text: "UPDATE carts WHERE SET products = $1 WHERE id = $2",
          args: [params.data.products, params.data.id],
        });
      }

      return result.rows[0];
    } catch (error) {
      throw new Error("DB error", {
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
      throw new Error("DB error", {
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
      throw new Error("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }
}
