import { DatabaseError } from "../../utils/errors.ts";
import IPluginService from "../interfaces/pluginService.ts";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { Plugin, plugins } from "../../utils/schema.ts";
import { eq } from "drizzle-orm";

export default class PluginService implements IPluginService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Create(params: { data: Plugin }): Promise<Plugin> {
    try {
      //@ts-ignore not on type
      const result = await this.db.insert(plugins).values({
        name: params.data.name,
        shop: params.data.shop,
        token: params.data.token,
        type: params.data.type,
        url: params.data.url,
      }).returning();

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Get(params: { id: string }): Promise<Plugin> {
    try {
      const result = await this.db.select().from(plugins).where(
        eq(plugins.publicId, params.id),
      );

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Update(params: { data: Plugin }): Promise<Plugin> {
    try {
      const result = await this.db.update(plugins)
        .set({
          name: params.data.name,
          token: params.data.token,
          url: params.data.url,
        })
        .where(eq(plugins.publicId, params.data.publicId!))
        .returning();

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Delete(params: { id: string }): Promise<void> {
    try {
      await this.db.delete(plugins).where(eq(plugins.publicId, params.id));
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
