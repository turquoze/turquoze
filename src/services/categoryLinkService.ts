import DataService from "./dataService.ts";
import { CategoryLink, Product } from "../utils/validator.ts";
import { categorieslink } from "../utils/schema.ts";
import { and, eq, PostgresJsDatabase, sql } from "../deps.ts";
import { DatabaseError } from "../utils/errors.ts";

export default class CategoryLinkService extends DataService<CategoryLink> {
  constructor(db: PostgresJsDatabase) {
    super(db, categorieslink);
  }

  override Create(_params: { data: object }): Promise<CategoryLink> {
    throw Error("Not implemented");
  }

  override Get(_params: { id: string }): Promise<CategoryLink> {
    throw Error("Not implemented");
  }

  override GetMany(
    _params: {
      offset?: number | undefined;
      limit?: number | undefined;
      shop: string;
    },
  ): Promise<CategoryLink[]> {
    throw Error("Not implemented");
  }

  async Link(params: { data: CategoryLink }): Promise<CategoryLink> {
    try {
      const result = await this.db.insert(categorieslink).values({
        category: params.data.category,
        product: params.data.product,
      }).returning();

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetProducts(
    params: {
      id: string;
      offset?: number | undefined;
      limit?: number | undefined;
    },
  ): Promise<Product[]> {
    try {
      if (params.limit == undefined) {
        params.limit = 10;
      }

      if (params.offset == undefined) {
        params.offset = 0;
      }

      const result = await this.db.execute(
        sql`SELECT products.* FROM categorieslink RIGHT JOIN products ON categorieslink.product = products.public_id WHERE categorieslink.category = ${params.id} LIMIT ${params.limit} OFFSET ${params.offset}`,
      );

      const products = result.map((product) => {
        return {
          publicId: product.public_id,
          createdAt: product.created_at,
          active: product.active,
          parent: product.parent,
          title: product.title,
          shortDescription: product.short_description,
          longDescription: product.longDescription,
          images: product.images,
          shop: product.shop,
          id: product.id,
          slug: product.slug,
        };
      });

      //@ts-ignore not on type
      return products;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  override async Delete(
    params: { id: string; data: CategoryLink },
  ): Promise<void> {
    try {
      await this.db.delete(categorieslink).where(
        and(
          eq(categorieslink.category, params.data.category),
          eq(categorieslink.product, params.data.product),
        ),
      );
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
