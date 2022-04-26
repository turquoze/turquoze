import type postgresClient from "../dataClient/client.ts";
import IDiscountService from "../interfaces/discountService.ts";
import { Discount } from "../../utils/types.ts";
import { DatabaseError } from "../../utils/errors.ts";

export default class DiscountService implements IDiscountService {
  client: typeof postgresClient;
  constructor(client: typeof postgresClient) {
    this.client = client;
  }

  async Create(params: { data: Discount }): Promise<Discount> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Discount>({
        text:
          "INSERT INTO discounts (type, value, region, valid_from, valid_to, code) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
        args: [
          params.data.type,
          params.data.value,
          params.data.region,
          params.data.valid_from,
          params.data.valid_to,
          params.data.code,
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

  async Get(params: { id: string }): Promise<Discount> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Discount>({
        text: "SELECT * FROM discounts WHERE id = $1 LIMIT 1",
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

  async GetByCode(params: { code: string }): Promise<Discount> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Discount>({
        text: "SELECT * FROM discounts WHERE code = $1 LIMIT 1",
        args: [params.code],
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
    params: { offset?: string | undefined; limit?: number | undefined },
  ): Promise<Discount[]> {
    try {
      await this.client.connect();

      if (params.limit == null) {
        params.limit = 10;
      }
      const result = await this.client.queryObject<Discount>({
        text: "SELECT * FROM discounts LIMIT $1 OFFSET $2",
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

  async Delete(params: { id: string }): Promise<void> {
    try {
      await this.client.connect();

      await this.client.queryObject<void>({
        text: "DELETE FROM discounts WHERE id = $1",
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

  async Validate(params: { code: string }): Promise<Discount | undefined> {
    try {
      await this.client.connect();

      const data = await this.client.queryObject<Discount>({
        text: "SELECT * FROM discounts WHERE code = $1",
        args: [params.code],
      });

      if (data.rows.length > 0) {
        return data.rows[0];
      }
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }
}
