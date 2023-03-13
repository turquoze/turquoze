import { Shop, ShopLink } from "../../utils/types.ts";
import IShopLinkService from "../interfaces/shopLinkService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { Pool } from "../../deps.ts";

export default class ShopLinkService implements IShopLinkService {
  pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  async Link(params: { data: ShopLink }): Promise<ShopLink> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<ShopLink>({
        text: "INSERT INTO shopslink (admin, shop) VALUES ($1, $2)",
        args: [params.data.admin, params.data.shop],
      });

      client.release();
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetShops(
    params: {
      id: string;
      offset?: string | undefined;
      limit?: number | undefined;
    },
  ): Promise<Shop[]> {
    try {
      const client = await this.pool.connect();

      if (params.limit == null) {
        params.limit = 10;
      }

      const result = await client.queryObject<Shop>({
        text:
          "SELECT shops.* FROM shopslink RIGHT JOIN shops ON shopslink.shop = shops.public_id WHERE shopslink.admin = $1 LIMIT $2 OFFSET $3",
        args: [params.id, params.limit, params.offset],
      });

      client.release();
      return result.rows;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Delete(params: { data: ShopLink }): Promise<void> {
    try {
      const client = await this.pool.connect();

      await client.queryObject<ShopLink>({
        text: "DELETE FROM shopslink WHERE (admin = $1 AND shop = $2)",
        args: [params.data.admin, params.data.shop],
      });

      client.release();
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
