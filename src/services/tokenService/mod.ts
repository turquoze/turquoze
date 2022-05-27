import { Token } from "../../utils/types.ts";
import ITokenService from "../interfaces/tokenService.ts";
import type postgresClient from "../dataClient/client.ts";
import { DatabaseError } from "../../utils/errors.ts";

export default class TokenService implements ITokenService {
  client: typeof postgresClient;
  constructor(client: typeof postgresClient) {
    this.client = client;
  }

  async Create(params: { data: Token }): Promise<Token> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Token>({
        text:
          "INSERT INTO tokens (name, token, shop, expire) VALUES ($1, $2, $3, $4) RETURNING token",
        args: [
          params.data.name,
          params.data.token,
          params.data.shop,
          params.data.expire,
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

  async Get(params: { token: string }): Promise<Token> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Token>({
        text: "SELECT * FROM tokens WHERE token = $1 LIMIT 1",
        args: [params.token],
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
  ): Promise<Array<Token>> {
    try {
      if (params.limit == null) {
        params.limit = 10;
      }
      await this.client.connect();

      const result = await this.client.queryObject<Token>({
        text: "SELECT * FROM tokens LIMIT $1 OFFSET $2",
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

  async Delete(params: { token: string }): Promise<void> {
    try {
      await this.client.connect();

      await this.client.queryObject<Token>({
        text: "DELETE FROM tokens WHERE token = $1",
        args: [params.token],
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
