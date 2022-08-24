import { Token } from "../../utils/types.ts";
import ITokenService from "../interfaces/tokenService.ts";
import type postgresClient from "../dataClient/client.ts";
import { DatabaseError } from "../../utils/errors.ts";

export default class TokenService implements ITokenService {
  pool: typeof postgresClient;
  constructor(pool: typeof postgresClient) {
    this.pool = pool;
  }

  async Create(params: { data: Token }): Promise<Token> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Token>({
        text:
          "INSERT INTO tokens (name, token, shop, expire) VALUES ($1, $2, $3, $4) RETURNING token",
        args: [
          params.data.name,
          params.data.token,
          params.data.shop,
          params.data.expire,
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

  async Get(params: { token: string }): Promise<Token> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Token>({
        text: "SELECT * FROM tokens WHERE token = $1 LIMIT 1",
        args: [params.token],
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
    params: { offset?: string; limit?: number },
  ): Promise<Array<Token>> {
    try {
      if (params.limit == null) {
        params.limit = 10;
      }
      const client = await this.pool.connect();

      const result = await client.queryObject<Token>({
        text: "SELECT * FROM tokens LIMIT $1 OFFSET $2",
        args: [params.limit, params.offset],
      });

      client.release();
      return result.rows;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Delete(params: { token: string }): Promise<void> {
    try {
      const client = await this.pool.connect();

      await client.queryObject<Token>({
        text: "DELETE FROM tokens WHERE token = $1",
        args: [params.token],
      });

      client.release();
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
