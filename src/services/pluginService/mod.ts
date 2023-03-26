import { Pool } from "../../deps.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { Plugin } from "../../utils/types.ts";
import IPluginService from "../interfaces/pluginService.ts";

export default class PluginService implements IPluginService {
  pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  async Create(params: { data: Plugin }): Promise<Plugin> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Plugin>({
        text:
          "INSERT INTO plugins (name, shop, token, type, url) VALUES ($1, $2, $3, $4, $5) RETURNING public_id",
        args: [
          params.data.name,
          params.data.shop,
          params.data.token,
          params.data.type,
          params.data.url,
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

  async Get(params: { id: string }): Promise<Plugin> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Plugin>({
        text: "SELECT * FROM plugins WHERE public_id = $1 LIMIT 1",
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

  async Update(params: { data: Plugin }): Promise<Plugin> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Plugin>({
        text:
          "UPDATE plugins SET name = $1, token = $2, url = $3 WHERE public_id = $4 RETURNING public_id",
        args: [
          params.data.name,
          params.data.token,
          params.data.url,
          params.data.public_id,
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

  async Delete(params: { id: string }): Promise<void> {
    try {
      const client = await this.pool.connect();

      await client.queryObject<void>({
        text: "DELETE FROM plugins WHERE public_id = $1",
        args: [params.id],
      });

      client.release();
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
