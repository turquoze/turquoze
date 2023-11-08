import { ShopLinkData } from "../../utils/types.ts";
import IShopLinkService from "../interfaces/shopLinkService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { ShopLink, shopslink } from "../../utils/schema.ts";
import { and, eq, sql } from "drizzle-orm";

export default class ShopLinkService implements IShopLinkService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Link(params: { data: ShopLink }): Promise<ShopLink> {
    try {
      // @ts-expect-error not on type
      const result = await this.db.insert(shopslink).values({
        admin: params.data.admin,
        shop: params.data.shop,
      }).returning();

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetShops(
    params: {
      id: string;
      offset?: number | undefined;
      limit?: number | undefined;
    },
  ): Promise<ShopLinkData[]> {
    try {
      if (params.limit == null) {
        params.limit = 10;
      }

      if (params.offset == undefined) {
        params.offset = 0;
      }

      const result = await this.db.execute(
        sql`SELECT shops.*, shopslink.role FROM shopslink RIGHT JOIN shops ON shopslink.shop = shops.public_id WHERE shopslink.admin = ${params.id} LIMIT ${params.limit} OFFSET ${params.offset}`,
      );

      //@ts-ignore not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetShop(
    params: { shopId: string; adminId: string },
  ): Promise<ShopLink> {
    try {
      const result = await this.db.select().from(shopslink).where(
        and(
          eq(shopslink.admin, params.adminId),
          eq(shopslink.shop, params.shopId),
        ),
      );

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Delete(params: { data: ShopLink }): Promise<void> {
    try {
      await this.db.delete(shopslink).where(
        and(
          eq(shopslink.admin, params.data.admin),
          eq(shopslink.shop, params.data.shop),
        ),
      );
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
