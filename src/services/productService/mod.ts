import { Product } from "../../utils/types.ts";
import IProductService from "../interfaces/productService.ts";
import type postgresClient from "../dataClient/client.ts";
import { DatabaseError } from "../../utils/errors.ts";

export default class ProductService implements IProductService {
  client: typeof postgresClient;
  constructor(client: typeof postgresClient) {
    this.client = client;
  }

  async Create(params: { data: Product }): Promise<Product> {
    try {
      await this.client.connect();

      let result;

      if (params.data.id == "") {
        result = await this.client.queryObject<Product>({
          text:
            "INSERT INTO products (active, price, title, parent, description, images, region) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
          args: [
            params.data.active,
            params.data.price,
            params.data.title,
            params.data.parent,
            params.data.description,
            params.data.images,
            params.data.region,
          ],
        });
      } else {
        result = await this.client.queryObject<Product>({
          text:
            "INSERT INTO products (active, price, title, parent, description, images, region) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
          args: [
            params.data.active,
            params.data.price,
            params.data.title,
            params.data.parent,
            params.data.description,
            params.data.images,
            params.data.region,
          ],
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

  async Get(params: { id: string }): Promise<Product> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Product>({
        text: "SELECT * FROM products WHERE id = $1 LIMIT 1",
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
      throw new DatabaseError("DB error", {
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
          "UPDATE products SET title = $1, description = $2, active = $3, parent = $4, price = $5, images = $6 WHERE id = $7 RETURNING id",
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

      await this.client.queryObject<Product>({
        text: "DELETE FROM products WHERE id = $1",
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
