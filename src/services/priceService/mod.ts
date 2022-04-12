import { Price } from "../../utils/types.ts";
import IPriceService from "../interfaces/priceService.ts";
import type postgresClient from "../dataClient/client.ts";
import { DatabaseError } from "../../utils/errors.ts";

export default class PriceService implements IPriceService {
  client: typeof postgresClient;
  constructor(client: typeof postgresClient) {
    this.client = client;
  }

  async Create(params: { data: Price }): Promise<Price> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Price>({
        text:
          "INSERT INTO prices (amount, region) VALUES ($1, $2) RETURNING id",
        args: [
          params.data.amount,
          params.data.region,
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

  async Get(params: { id: string }): Promise<Price> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Price>({
        text: "SELECT * FROM prices WHERE id = $1 LIMIT 1",
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

  async GetMany(
    params: { offset?: string; limit?: number },
  ): Promise<Array<Price>> {
    try {
      await this.client.connect();

      if (params.limit == null) {
        params.limit = 10;
      }
      const result = await this.client.queryObject<Price>({
        text: "SELECT * FROM prices LIMIT $1 OFFSET $2",
        args: [params.limit, params.offset],
      });

      return result.rows;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }

  async Update(params: { data: Price }): Promise<Price> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Price>({
        text: "UPDATE prices SET amount = $1 WHERE id = $2 RETURNING id",
        args: [
          params.data.amount,
          params.data.id,
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

      await this.client.queryObject<Price>({
        text: "DELETE FROM prices WHERE id = $1",
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
