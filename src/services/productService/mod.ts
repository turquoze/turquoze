import { Product } from "../../utils/types.ts";
import IProductService from "../interfaces/productService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { Pool } from "../../deps.ts";

export default class ProductService implements IProductService {
  pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  async Create(params: { data: Product }): Promise<Product> {
    try {
      const client = await this.pool.connect();

      let result;

      if (params.data.public_id == "") {
        result = await client.queryObject<Product>({
          text:
            "INSERT INTO products (active, title, parent, short_description, long_description, images, shop, slug) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING public_id",
          args: [
            params.data.active,
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
            "INSERT INTO products (active, title, parent, short_description, long_description, images, shop, slug) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING public_id",
          args: [
            params.data.active,
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

  async GetVariantsByParent(params: { id: string }): Promise<Product[]> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Product>({
        text: "SELECT * FROM products WHERE parent = $1",
        args: [params.id],
      });

      client.release();
      return result.rows;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetMany(
    params: { offset?: string; limit?: number; shop: string },
  ): Promise<Array<Product>> {
    try {
      if (params.limit == null) {
        params.limit = 10;
      }

      const client = await this.pool.connect();

      const result = await client.queryObject<Product>({
        text: "SELECT * FROM products WHERE shop = $1 LIMIT $2 OFFSET $3",
        args: [params.shop, params.limit, params.offset],
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
          "UPDATE products SET title = $1, short_description = $2, long_description = $3, active = $4, parent = $5, images = $6, slug = $7 WHERE public_id = $8 RETURNING public_id",
        args: [
          params.data.title,
          params.data.short_description,
          params.data.long_description,
          params.data.active,
          params.data.parent,
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
