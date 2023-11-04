import { Oauth } from "../../utils/types.ts";
import { DatabaseError } from "../../utils/errors.ts";
import IOauthService from "../interfaces/oauthService.ts";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { oauthTokens } from "../../utils/schema.ts";
import { eq } from "drizzle-orm";

export default class OauthService implements IOauthService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Create(params: { data: Oauth }): Promise<Oauth> {
    try {
      //@ts-expect-error not on type
      const result = await this.db.insert(oauthTokens).values({
        token: params.data.token,
        expiresAt: params.data.expiresAt,
        plugin: params.data.plugin,
      }).returning();

      //@ts-expect-error not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Get(params: { id: string }): Promise<Oauth> {
    try {
      const result = await this.db.select().from(oauthTokens).where(
        eq(oauthTokens.publicId, params.id),
      );
      //@ts-expect-error not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetByToken(params: { token: string }): Promise<Oauth> {
    try {
      const result = await this.db.select().from(oauthTokens).where(
        eq(oauthTokens.token, params.token),
      );
      //@ts-expect-error not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  GetMany(
    _params: { offset?: number; limit?: number; shop: string },
  ): Promise<Array<Oauth>> {
    throw Error();
    //TODO: add shop to route
    /*
    try {
      if (params.limit == undefined) {
        params.limit = 10;
      }

      if (params.offset == undefined) {
        params.offset = 0;
      }

      const result = await this.db.select().from(oauthTokens).where(
        eq(oauthTokens.shop, params.shop),
      ).limit(params.limit).offset(params.offset);
      // @ts-expect-error not on type
      return result;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }*/
  }

  async Delete(params: { tokenId: string }): Promise<void> {
    try {
      await this.db.delete(oauthTokens).where(
        eq(oauthTokens.publicId, params.tokenId),
      );
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
