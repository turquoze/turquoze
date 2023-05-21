import { Shop, Token, TurquozeRole } from "../../utils/types.ts";
import ITokenService from "../interfaces/tokenService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { Pool } from "../../deps.ts";

export default class TokenService implements ITokenService {
  pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  async Create(params: { data: Token }): Promise<Token> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Token>({
        text:
          "INSERT INTO tokens (id, name, role, secret, shop) VALUES ($1, $2, $3, crypt($4, gen_salt('bf')), $5) RETURNING id",
        args: [
          params.data.id,
          params.data.name,
          params.data.role,
          params.data.secret,
          params.data.shop,
        ],
      });

      client.release();
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetShopByToken(
    params: { tokenId: string; tokenSecret: string },
  ): Promise<{ shop: Shop; role: TurquozeRole }> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Shop>({
        text:
          "SELECT shops.*, tokens.role FROM tokens RIGHT JOIN shops ON tokens.shop = shops.public_id WHERE tokens.id = $1 AND tokens.secret = crypt($2, tokens.secret) LIMIT 1",
        args: [params.tokenId, params.tokenSecret],
      });

      client.release();
      return {
        shop: result.rows[0],
        // @ts-expect-error not on type
        role: result.rows[0].role,
      };
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Get(params: { tokenId: string }): Promise<Token> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Token>({
        text: "SELECT * FROM tokens WHERE id = $1 LIMIT 1",
        args: [params.tokenId],
      });

      client.release();
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetMany(
    params: { offset?: string; limit?: number; shop: string },
  ): Promise<Array<Token>> {
    try {
      if (params.limit == null) {
        params.limit = 10;
      }
      const client = await this.pool.connect();

      const result = await client.queryObject<Token>({
        text: "SELECT * FROM tokens WHERE shop = $1 LIMIT $2 OFFSET $3",
        args: [params.shop, params.limit, params.offset],
      });

      client.release();
      return result.rows;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Delete(params: { tokenId: string }): Promise<void> {
    try {
      const client = await this.pool.connect();

      await client.queryObject<Token>({
        text: "DELETE FROM tokens WHERE id = $1",
        args: [params.tokenId],
      });

      client.release();
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
