import { Product } from "../../utils/types.ts";
import IProductService from "../interfaces/productService.ts";
import type postgresClient from "../dataClient/client.ts";
import { DatabaseError } from "../../utils/errors.ts";

export default class ProductService implements IProductService {
  pool: typeof postgresClient;
  constructor(pool: typeof postgresClient) {
    this.pool = pool;
  }

  async Create(params: { data: Product }): Promise<Product> {
    try {
      const client = await this.pool.connect();

      let result;

      if (params.data.public_id == "") {
        result = await client.queryObject<Product>({
          text:
            "INSERT INTO products (active, price, title, parent, short_description, long_description, images, shop, slug) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING public_id",
          args: [
            params.data.active,
            params.data.price,
            params.data.title,
            params.data.parent,
            params.data.short_description,
            params.data.long_description,
            params.data.images,
            params.data.shop,
            params.data.slug,
          ],
        });
      } else {
        result = await client.queryObject<Product>({
          text:
            "INSERT INTO products (active, price, title, parent, short_description, long_description, images, shop, slug) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING public_id",
          args: [
            params.data.active,
            params.data.price,
            params.data.title,
            params.data.parent,
            params.data.short_description,
            params.data.long_description,
            params.data.images,
            params.data.shop,
            params.data.slug,
          ],
        });
      }

      client.release();
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Get(params: { id: string }): Promise<Product> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Product>({
        text: "SELECT * FROM products WHERE public_id = $1 LIMIT 1",
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

  async GetBySlug(params: { slug: string }): Promise<Product> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Product>({
        text: "SELECT * FROM products WHERE slug = $1 LIMIT 1",
        args: [params.slug],
      });

      client.release();
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetMany(
    params: { offset?: string; limit?: number },
  ): Promise<Array<Product>> {
    try {
      if (params.limit == null) {
        params.limit = 10;
      }

      const client = await this.pool.connect();

      const result = await client.queryObject<Product>({
        text: "SELECT * FROM products LIMIT $1 OFFSET $2",
        args: [params.limit, params.offset],
      });

      client.release();
      return result.rows;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Update(params: { data: Product }): Promise<Product> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Product>({
        text:
          "UPDATE products SET title = $1, short_description = $2, long_description = $3, active = $4, parent = $5, price = $6, images = $7, slug = $8 WHERE public_id = $9 RETURNING public_id",
        args: [
          params.data.title,
          params.data.short_description,
          params.data.long_description,
          params.data.active,
          params.data.parent,
          params.data.price,
          params.data.images,
          params.data.slug,
          params.data.public_id,
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

  async Delete(params: { id: string }): Promise<void> {
    try {
      const client = await this.pool.connect();

      await client.queryObject<Product>({
        text: "DELETE FROM products WHERE public_id = $1",
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
