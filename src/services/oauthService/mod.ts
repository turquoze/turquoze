import { Oauth } from "../../utils/types.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { Pool } from "../../deps.ts";
import IOauthService from "../interfaces/oauthService.ts";

export default class OauthService implements IOauthService {
  pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  async Create(params: { data: Oauth }): Promise<Oauth> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Oauth>({
        text:
          "INSERT INTO oauth_tokens (token, expires_at, plugin) VALUES ($1, $2, $3) RETURNING public_id",
        args: [
          params.data.token,
          params.data.expires_at,
          params.data.plugin,
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

  async Get(params: { id: string }): Promise<Oauth> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Oauth>({
        text: "SELECT * FROM oauth_tokens WHERE public_id = $1 LIMIT 1",
        args: [params.id],
      });

      client.release();
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetByToken(params: { token: string }): Promise<Oauth> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Oauth>({
        text: "SELECT * FROM oauth_tokens WHERE token = $1 LIMIT 1",
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
    params: { offset?: string; limit?: number; shop: string },
  ): Promise<Array<Oauth>> {
    try {
      if (params.limit == null) {
        params.limit = 10;
      }
      const client = await this.pool.connect();

      const result = await client.queryObject<Oauth>({
        text: "SELECT * FROM oauth_tokens WHERE shop = $1 LIMIT $2 OFFSET $3",
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

      await client.queryObject<Oauth>({
        text: "DELETE FROM oauth_tokens WHERE public_id = $1",
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
