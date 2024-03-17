import IInventoryService from "../interfaces/inventoryService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import { inventories } from "../../utils/schema.ts";
import { eq, type PostgresJsDatabase, sql } from "../../deps.ts";
import { Inventory } from "../../utils/validator.ts";

export default class CartService implements IInventoryService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Create(params: { data: Inventory }): Promise<Inventory> {
    try {
      //@ts-ignore not on type
      const result = await this.db.insert(inventories).values({
        product: params.data.product,
        quantity: params.data.quantity,
        warehouse: params.data.warehouse,
      }).returning();

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
        .where(eq(inventories.publicId, params.data.publicId!))
        .returning();

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
        sql`SELECT inventories.*, warehouses.name AS warehouse_name FROM inventories INNER JOIN warehouses ON inventories.warehouse = warehouses.public_id WHERE inventories.product = ${params.id}`,
      );

      const inventories = result.map((data) => {
        const inventory: Inventory = {
          //@ts-ignore TS2578
          product: data.product,
          //@ts-ignore TS2578
          warehouse: data.warehouse,
          //@ts-ignore TS2578
          quantity: data.quantity,
          //@ts-ignore TS2578
          publicId: data.public_id,
          //@ts-ignore TS2578
          createdAt: data.created_at,
          warehouse_name: data.warehouse_name,
        };

        return inventory;
      });

      return inventories;
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
