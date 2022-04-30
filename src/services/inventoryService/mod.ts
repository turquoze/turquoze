import type postgresClient from "../dataClient/client.ts";
import IInventoryService from "../interfaces/inventoryService.ts";
import { Inventory } from "../../utils/types.ts";
import { DatabaseError } from "../../utils/errors.ts";
import ICacheService from "../interfaces/cacheService.ts";

export default class CartService implements IInventoryService {
  client: typeof postgresClient;
  cache: ICacheService;
  constructor(client: typeof postgresClient, cache: ICacheService) {
    this.client = client;
    this.cache = cache;
  }

  async Create(params: { data: Inventory }): Promise<Inventory> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Inventory>({
        text:
          "INSERT INTO inventories (product, quantity, warehouse) VALUES ($1, $2, $3) RETURNING id",
        args: [
          params.data.product,
          params.data.quantity,
          params.data.warehouse,
        ],
      });

      await this.cache.set({
        id: params.data.id,
        data: { inventory: params.data },
        expire: Date.now() + (60000 * 60),
      });

      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }

  async Update(params: { data: Inventory }): Promise<Inventory> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Inventory>({
        text: "UPDATE inventories SET quantity = $1 WHERE id = $2 RETURNING id",
        args: [params.data.quantity, params.data.id],
      });

      await this.cache.set({
        id: params.data.id,
        data: { inventory: params.data },
        expire: Date.now() + (60000 * 60),
      });

      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }

  async Get(params: { id: string }): Promise<Inventory> {
    try {
      const cacheResult = await this.cache.get(params.id);

      if (cacheResult != null) {
        // @ts-expect-error wrong type
        return cacheResult.inventory;
      }

      await this.client.connect();

      const result = await this.client.queryObject<Inventory>({
        text: "SELECT * FROM inventories WHERE id = $1 LIMIT 1",
        args: [params.id],
      });

      await this.cache.set({
        id: params.id,
        data: { inventory: result.rows[0] },
        expire: Date.now() + (60000 * 60),
      });

      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }

  async Delete(params: { id: string }): Promise<void> {
    try {
      await this.client.connect();

      await this.client.queryObject<Inventory>({
        text: "DELETE FROM inventories WHERE id = $1",
        args: [params.id],
      });

      await this.cache.delete(params.id);
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }
}
