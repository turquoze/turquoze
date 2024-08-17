import ICategoryLinkService from "../interfaces/categoryLinkService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import { categorieslink } from "../../utils/schema.ts";
import { CategoryLink, Product } from "../../utils/validator.ts";
import { and, eq, type PostgresJsDatabase, sql } from "../../deps.ts";

export default class CategoryLinkService implements ICategoryLinkService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Link(params: { data: CategoryLink }): Promise<CategoryLink> {
    try {
      //@ts-expect-error not on type
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

  async Delete(params: { data: CategoryLink }): Promise<void> {
    try {
      //@ts-expect-error not on type
      await this.db.delete(categorieslink).where(
        and(
          //@ts-expect-error not on type
          eq(categorieslink.category, params.data.category),
          //@ts-expect-error not on type
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
