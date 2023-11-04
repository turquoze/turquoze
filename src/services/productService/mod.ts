import { Product } from "../../utils/types.ts";
import IProductService from "../interfaces/productService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { products } from "../../utils/schema.ts";
import { eq } from "drizzle-orm";

export default class ProductService implements IProductService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Create(params: { data: Product }): Promise<Product> {
    try {
      let result;

      if (params.data.publicId == "" || params.data.publicId == undefined) {
        //@ts-expect-error not on type
        result = await this.db.insert(products).values({
          active: params.data.active,
          title: params.data.title,
          parent: params.data.parent,
          shortDescription: params.data.shortDescription,
          longDescription: params.data.longDescription,
          images: params.data.images,
          slug: params.data.slug,
          shop: params.data.shop,
        }).returning();
      } else {
        result = await this.db.update(products).set({
          active: params.data.active,
          title: params.data.title,
          parent: params.data.parent,
          shortDescription: params.data.shortDescription,
          longDescription: params.data.longDescription,
          images: params.data.images,
          slug: params.data.slug,
          shop: params.data.shop,
        })
          .where(eq(products.publicId, params.data.publicId!))
          .returning();
      }

      //@ts-expect-error not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Get(params: { id: string }): Promise<Product> {
    try {
      const result = await this.db.select().from(products).where(
        eq(products.publicId, params.id),
      );
      //@ts-expect-error not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetBySlug(params: { slug: string }): Promise<Product> {
    try {
      const result = await this.db.select().from(products).where(
        eq(products.slug, params.slug),
      );
      //@ts-expect-error not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetVariantsByParent(params: { id: string }): Promise<Product[]> {
    try {
      const result = await this.db.select().from(products).where(
        eq(products.parent, params.id),
      );
      //@ts-expect-error not on type
      return result;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetMany(
    params: { offset?: number; limit?: number; shop: string },
  ): Promise<Array<Product>> {
    try {
      if (params.limit == undefined) {
        params.limit = 10;
      }

      if (params.offset == undefined) {
        params.offset = 0;
      }

      const result = await this.db.select().from(products).where(
        eq(products.shop, params.shop),
      ).limit(params.limit).offset(params.offset);
      //@ts-expect-error not on type
      return result;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Update(params: { data: Product }): Promise<Product> {
    try {
      const result = await this.db.update(products)
        .set({
          title: params.data.title,
          shortDescription: params.data.shortDescription,
          longDescription: params.data.longDescription,
          active: params.data.active,
          parent: params.data.parent,
          images: params.data.images,
          slug: params.data.slug,
          shop: params.data.shop,
        })
        .where(eq(products.publicId, params.data.publicId!))
        .returning();

      // @ts-expect-error not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Delete(params: { id: string }): Promise<void> {
    try {
      await this.db.delete(products).where(eq(products.publicId, params.id));
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
