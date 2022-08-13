import type postgresClient from "../dataClient/client.ts";
import IShopService from "../interfaces/shopService.ts";
import { Shop } from "../../utils/types.ts";
import { DatabaseError } from "../../utils/errors.ts";

export default class ShopService implements IShopService {
  client: typeof postgresClient;
  constructor(client: typeof postgresClient) {
    this.client = client;
  }

  async Create(params: { data: Shop }): Promise<Shop> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Shop>({
        text:
          "INSERT INTO shops (name, currency, regions, payment_id, url) VALUES ($1, $2, $3, $4, $5) RETURNING public_id",
        args: [
          params.data.name,
          params.data.currency,
          params.data.regions,
          params.data.payment_id,
          params.data.url,
        ],
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

  async Get(params: { id: string }): Promise<Shop> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Shop>({
        text: "SELECT * FROM shops WHERE public_id = $1 LIMIT 1",
        args: [params.id],
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

  async Update(params: { data: Shop }): Promise<Shop> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Shop>({
        text:
          "UPDATE shops SET name = $1, currency = $2, regions = $3, payment_id = $4, url = $6 WHERE public_id = $5 RETURNING public_id",
        args: [
          params.data.name,
          params.data.currency,
          params.data.regions,
          params.data.payment_id,
          params.data.public_id,
          params.data.url,
        ],
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

      await this.client.queryObject<void>({
        text: "DELETE FROM shops WHERE public_id = $1",
        args: [params.id],
      });
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }
}
