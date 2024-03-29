import { DatabaseError } from "../../utils/errors.ts";
import IPluginService from "../interfaces/pluginService.ts";
import { plugins } from "../../utils/schema.ts";
import { and, eq, type PostgresJsDatabase } from "../../deps.ts";
import { Plugin } from "../../utils/validator.ts";

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
        and(
          eq(plugins.deleted, false),
          eq(plugins.publicId, params.id),
        ),
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
      await this.db.update(plugins).set({
        deleted: true,
      }).where(eq(plugins.publicId, params.id));
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
