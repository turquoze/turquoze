import IInventoryService from "../interfaces/inventoryService.ts";
import { Inventory } from "../../utils/types.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import { inventories } from "../../utils/schema.ts";
import { eq } from "drizzle-orm";

export default class CartService implements IInventoryService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Create(params: { data: Inventory }): Promise<Inventory> {
    try {
      //@ts-expect-error not on type
      const result = await this.db.insert(inventories).values({
        product: params.data.product,
        quantity: params.data.quantity,
        warehouse: params.data.warehouse,
      }).returning();

      //@ts-expect-error not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Update(params: { data: Inventory }): Promise<Inventory> {
    try {
      const result = await this.db.update(inventories)
        .set({
          quantity: params.data.quantity,
        })
        .where(eq(inventories.publicId, params.data.publicId))
        .returning();

      //@ts-expect-error not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Get(params: { id: string }): Promise<Inventory> {
    try {
      const result = await this.db.select().from(inventories).where(
        eq(inventories.publicId, params.id),
      );
      //@ts-expect-error not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetInventoryByProduct(
    params: { id: string },
  ): Promise<Array<Inventory>> {
    try {
      const result = await this.db.execute(
        sql`SELECT inventories.*, warehouses.name AS warehouse_name FROM inventories INNER JOIN warehouses ON inventories.warehouse = warehouses.publicId WHERE inventories.product = ${params.id}`,
      );

      //@ts-expect-error not on type
      return result;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Delete(params: { id: string }): Promise<void> {
    try {
      await this.db.delete(inventories).where(
        eq(inventories.publicId, params.id),
      );
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
