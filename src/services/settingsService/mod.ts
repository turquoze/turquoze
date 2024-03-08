import ISettingsService from "../interfaces/settingsService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { Settings } from "../../utils/types.ts";
import { shops } from "../../utils/schema.ts";
import { eq, type PostgresJsDatabase } from "../../deps.ts";

export default class SettingsService implements ISettingsService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Upsert(params: { data: Settings; shopId: string }): Promise<void> {
    try {
      await this.db.update(shops)
        .set({
          settings: params.data,
        })
        .where(eq(shops.publicId, params.shopId));
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  /*async*/ GetById(_params: { id: string }): Promise<string> {
    /*
    const obj = Object.entries(container.Shop.settings).find((x) =>
      x[0] == params.id
    );

    if (obj != undefined) {
      await new Promise((resolve, _reject) => {
        resolve("");
      });
      return obj[1] as string;
    }

    throw new Error("No setting");
    */
    throw new Error();
  }

  /*async*/ Get(): Promise<Settings> {
    /*await new Promise((resolve, _reject) => {
      resolve("");
    });
    return container.Shop.settings;
    */
    throw new Error();
  }
}
