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
        text:
          "INSERT INTO products (id, created_at, active, price, title, parent, description, images, region) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
        args: [
          params.data.id,
          params.data.created_at,
          params.data.active,
          params.data.price,
          params.data.title,
          params.data.parent,
          params.data.description,
          params.data.images,
          params.data.region,
        ],
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

  async Update(params: { data: Product }): Promise<Product> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Product>({
        text:
          "UPDATE products SET title = $1, description = $2, active = $3, parent = $4, price = $5, images = $6 WHERE id = $7",
        args: [
          params.data.title,
          params.data.description,
          params.data.active,
          params.data.parent,
          params.data.price,
          params.data.images,
          params.data.id,
        ],
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
