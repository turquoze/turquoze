import { Product } from "../../utils/types.ts";
import IProductService from "../interfaces/productService.ts";
import client from "../dataClient/client.ts";
import type postgresClient from "../dataClient/client.ts";

export default class ProductService implements IProductService {
  client: typeof postgresClient;
  constructor() {
    this.client = client;
  }

  async Create(params: { data: Product }): Promise<Product> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Product>({
        text: "INSERT INTO products (name, description) VALUES ($1, $2)",
        args: [params.data.name, params.data.description],
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

  async Get(params: { id: string }): Promise<Product> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Product>({
        text: "SELECT * FROM products WHERE id = $1 LIMIT 1",
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

  async GetMany(
    params: { offset?: string; limit?: number },
  ): Promise<Array<Product>> {
    try {
      await this.client.connect();

      if (params.limit == null) {
        params.limit = 10;
      }
      const result = await this.client.queryObject<Product>({
        text: "SELECT * FROM products LIMIT $1 OFFSET $2",
        args: [params.limit, params.offset],
      });

      return result.rows;
    } catch (error) {
      throw new Error("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }

  Update(params: { data: Product }): Promise<Product> {
    throw Error("Not implemented");
    /*try {
      await this.client.connect();

      const result = await this.client.queryObject<Product>({
        text: "UPDATE products WHERE SET name = $1, description = $2 WHERE pid = $3",
        args: [params.data.name, params.data.description, params.data.pid],
      });

      return result.rows[0];
    } catch (error) {
      throw new Error("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }*/
  }

  async Delete(params: { id: string }): Promise<void> {
    try {
      await this.client.connect();

      await this.client.queryObject<Product>({
        text: "DELETE FROM products WHERE id = $1",
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
