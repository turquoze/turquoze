import { ShopLinkData } from "../../utils/types.ts";
import IShopLinkService from "../interfaces/shopLinkService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import { shopslink } from "../../utils/schema.ts";
import { and, eq, type PostgresJsDatabase, sql } from "../../deps.ts";
import { ShopLink } from "../../utils/validator.ts";

export default class ShopLinkService implements IShopLinkService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Link(params: { data: ShopLink }): Promise<ShopLink> {
    try {
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

      const shopLinks = result.map((data) => {
        const shopLink: ShopLinkData = {
          //@ts-ignore TS2578
          id: data.id,
          //@ts-ignore TS2578
          publicId: data.public_id,
          //@ts-ignore TS2578
          currency: data.currency,
          //@ts-ignore TS2578
          name: data.name,
          //@ts-ignore TS2578
          regions: data.regions,
          //@ts-ignore TS2578
          search_index: data.search_index,
          //@ts-ignore TS2578
          secret: data.secret,
          //@ts-ignore TS2578
          settings: data.settings,
          //@ts-ignore TS2578
          url: data.url,
          //@ts-ignore TS2578
          paymentId: data.payment_id,
          //@ts-ignore TS2578
          shippingId: data.shipping_id,
          //@ts-ignore TS2578
          role: data.role,
        };

        return shopLink;
      });

      return shopLinks;
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
