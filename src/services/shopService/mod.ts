import IShopService from "../interfaces/shopService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import { shops } from "../../utils/schema.ts";
import { DBShop as Shop } from "../../utils/validator.ts";
import { and, eq, type PostgresJsDatabase } from "../../deps.ts";

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
      //@ts-expect-error not on type
      const result = await this.db.select().from(shops).where(
        and(
          //@ts-expect-error not on type
          eq(shops.deleted, false),
          //@ts-expect-error not on type
          eq(shops.publicId, params.id),
        ),
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
      //@ts-expect-error not on type
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
        //@ts-expect-error not on type
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
      //@ts-expect-error not on type
      await this.db.update(shops).set({
        deleted: true,
        //@ts-expect-error not on type
      }).where(eq(shops.publicId, params.id));
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
