import { Token } from "../../utils/types.ts";
import ITokenService from "../interfaces/tokenService.ts";
import type postgresClient from "../dataClient/client.ts";
import { DatabaseError } from "../../utils/errors.ts";
import ICacheService from "../interfaces/cacheService.ts";

export default class TokenService implements ITokenService {
  client: typeof postgresClient;
  cache: ICacheService;
  constructor(client: typeof postgresClient, cache: ICacheService) {
    this.client = client;
    this.cache = cache;
  }

  async Create(params: { data: Token }): Promise<Token> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<Token>({
        text:
          "INSERT INTO tokens (name, token, region, expire) VALUES ($1, $2, $3, $4) RETURNING token",
        args: [
          params.data.name,
          params.data.token,
          params.data.region,
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
      const cacheResult = await this.cache.get(params.token);

      if (cacheResult != null) {
        // @ts-expect-error wrong type
        return cacheResult.token;
      }

      await this.client.connect();

      const result = await this.client.queryObject<Token>({
        text: "SELECT * FROM tokens WHERE token = $1 LIMIT 1",
        args: [params.token],
      });

      await this.cache.set({
        id: `token-${params.token}`,
        data: { token: result.rows[0] },
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

      await this.cache.delete(`token-${params.token}`);
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }
}
