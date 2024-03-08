import IWarehouseService from "../interfaces/warehouseService.ts";
//import { Warehouse } from "../../utils/types.ts";
import { DatabaseError } from "../../utils/errors.ts";
import { Warehouse, warehouses } from "../../utils/schema.ts";
import { eq, type PostgresJsDatabase } from "../../deps.ts";

export default class CartService implements IWarehouseService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Create(params: { data: Warehouse }): Promise<Warehouse> {
    try {
      // @ts-expect-error not on type
      const result = await this.db.insert(warehouses).values({
        address: params.data.address,
        country: params.data.country,
        name: params.data.name,
        shop: params.data.shop,
      }).returning();

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Update(params: { data: Warehouse }): Promise<Warehouse> {
    try {
      const result = await this.db.update(warehouses)
        .set({
          address: params.data.address,
          country: params.data.country,
          name: params.data.name,
        })
        .where(eq(warehouses.publicId, params.data.publicId!))
        .returning();

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Get(params: { id: string }): Promise<Warehouse> {
    try {
      const result = await this.db.select().from(warehouses).where(
        eq(warehouses.publicId, params.id),
      ).limit(1);

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetMany(
    params: {
      offset?: number | undefined;
      limit?: number | undefined;
      shop: string;
    },
  ): Promise<Warehouse[]> {
    try {
      if (params.limit == undefined) {
        params.limit = 10;
      }

      if (params.offset == undefined) {
        params.offset = 0;
      }

      const result = await this.db.select().from(warehouses).where(
        eq(warehouses.shop, params.shop),
      ).limit(params.limit).offset(params.offset);

      return result;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Delete(params: { id: string }): Promise<void> {
    try {
      await this.db.delete(warehouses).where(
        eq(warehouses.publicId, params.id),
      );
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
