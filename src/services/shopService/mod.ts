import IShopService from "../interfaces/shopService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import { DBShop as Shop, shops } from "../../utils/schema.ts";
import { eq, type PostgresJsDatabase } from "../../deps.ts";

export default class ShopService implements IShopService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Create(params: { data: Shop }): Promise<Shop> {
    try {
      //@ts-ignore not on type
      const result = await this.db.insert(shops).values({
        name: params.data.name,
        currency: params.data.currency,
        regions: params.data.regions,
        paymentId: params.data.paymentId,
        shippingId: params.data.shippingId,
        url: params.data.url,
        searchIndex: params.data.searchIndex,
        settings: params.data.settings,
      }).returning();

      //@ts-ignore not on type
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
      //@ts-ignore not on type
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
          searchIndex: params.data.searchIndex,
          settings: params.data.settings,
        })
        .where(eq(shops.publicId, params.data.publicId!))
        .returning();

      //@ts-ignore not on type
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
