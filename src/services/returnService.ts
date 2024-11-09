import DataService from "./dataService.ts";
import { returns } from "../utils/schema.ts";
import { eq, PostgresJsDatabase } from "../deps.ts";
import { OrderReturn } from "../utils/types.ts";
import { DatabaseError } from "../utils/errors.ts";

export default class ReturnService extends DataService<OrderReturn> {
  constructor(db: PostgresJsDatabase) {
    super(db, returns);
  }

  async SetReturnExported(params: { id: string }): Promise<OrderReturn> {
    try {
      const result = await this.db.update(returns)
        .set({
          exported: true,
        })
        .where(eq(returns.publicId, params.id))
        .returning();

      //@ts-ignore not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
