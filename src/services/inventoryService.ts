import DataService from "./dataService.ts";
import { Inventory } from "../utils/validator.ts";
import { inventories } from "../utils/schema.ts";
import { PostgresJsDatabase, sql } from "../deps.ts";
import { DatabaseError } from "../utils/errors.ts";

export default class InventoryService extends DataService<Inventory> {
  constructor(db: PostgresJsDatabase) {
    super(db, inventories);
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
}
