import IPluginDataService from "../interfaces/pluginDataService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { Pool } from "../../deps.ts";
import { PluginData } from "../../utils/types.ts";

export default class PluginDataService implements IPluginDataService {
  pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  async Create<T>(params: { data: PluginData<T> }): Promise<PluginData<T>> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<PluginData<T>>({
        text:
          "INSERT INTO pluginData (plugin_id, data, shop) VALUES ($1, $2, $3) RETURNING public_id",
        args: [
          params.data.plugin_id,
          params.data.data,
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

  async Get<T>(params: { id: string }): Promise<PluginData<T>> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<PluginData<T>>({
        text: "SELECT * FROM pluginData WHERE public_id = $1 LIMIT 1",
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

  async Update<T>(params: { data: PluginData<T> }): Promise<PluginData<T>> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<PluginData<T>>({
        text:
          "UPDATE pluginData SET data = $1 WHERE public_id = $2 RETURNING public_id",
        args: [
          params.data.data,
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

      await client.queryObject({
        text: "DELETE FROM pluginData WHERE public_id = $1",
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
