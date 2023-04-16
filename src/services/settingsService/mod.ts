import ISettingsService from "../interfaces/settingsService.ts";
import { DatabaseError } from "../../utils/errors.ts";
//import container from "../mod.ts";
import type { Pool } from "../../deps.ts";
import type { Settings, Shop } from "../../utils/types.ts";

export default class SettingsService implements ISettingsService {
  pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  async Upsert(params: { data: Settings; shopId: string }): Promise<void> {
    try {
      const client = await this.pool.connect();

      await client.queryObject<Shop>({
        text:
          "UPDATE shops SET settings = $1 WHERE public_id = $2 RETURNING public_id",
        args: [
          params.data,
          params.shopId,
        ],
      });

      client.release();
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
