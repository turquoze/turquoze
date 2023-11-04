import IShopService from "../interfaces/shopService.ts";
import { Shop } from "../../utils/types.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { shops } from "../../utils/schema.ts";
import { eq } from "drizzle-orm";

export default class ShopService implements IShopService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Create(params: { data: Shop }): Promise<Shop> {
    try {
      //@ts-expect-error not on type
      const result = await this.db.insert(shops).values({
        name: params.data.name,
        currency: params.data.currency,
        regions: params.data.regions,
        paymentId: params.data.paymentId,
        shippingId: params.data.shippingId,
        url: params.data.url,
        searchIndex: params.data.search_index,
        settings: params.data.settings,
      }).returning();

      //@ts-expect-error not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Get(params: { id: string }): Promise<Shop> {
    try {
      const result = await this.db.select().from(shops).where(
        eq(shops.publicId, params.id),
      );
      //@ts-expect-error not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Update(params: { data: Shop }): Promise<Shop> {
    try {
      const result = await this.db.update(shops)
        .set({
          name: params.data.name,
          currency: params.data.currency,
          regions: params.data.regions,
          paymentId: params.data.paymentId,
          shippingId: params.data.shippingId,
          url: params.data.url,
          searchIndex: params.data.search_index,
          settings: params.data.settings,
        })
        .where(eq(shops.publicId, params.data.publicId))
        .returning();

      //@ts-expect-error not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Delete(params: { id: string }): Promise<void> {
    try {
      await this.db.delete(shops).where(eq(shops.publicId, params.id));
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
