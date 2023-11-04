import { Shop, Token, TurquozeRole } from "../../utils/types.ts";
import ITokenService from "../interfaces/tokenService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import { tokens } from "../../utils/schema.ts";
import { eq } from "drizzle-orm";

export default class TokenService implements ITokenService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Create(params: { data: Token }): Promise<Token> {
    try {
      const result = await this.db.execute(
        sql`INSERT INTO tokens (id, name, role, secret, shop) VALUES (${params.data.id}, ${params.data.name}, ${params.data.role}, crypt(${params.data.secret}, gen_salt('bf')), ${params.data.shop}) RETURNING id`,
      );

      //@ts-expect-error not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetShopByToken(
    params: { tokenId: string; tokenSecret: string },
  ): Promise<{ shop: Shop; role: TurquozeRole }> {
    try {
      const result = await this.db.execute(
        sql`SELECT shops.*, tokens.role FROM tokens RIGHT JOIN shops ON tokens.shop = shops.publicId WHERE tokens.id = ${params.tokenId} AND tokens.secret = crypt(${params.tokenSecret}, tokens.secret) LIMIT 1`,
      );

      return {
        //@ts-expect-error not on type
        shop: result[0],
        // @ts-expect-error not on type
        role: result[0].role,
      };
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Get(params: { tokenId: string }): Promise<Token> {
    try {
      const result = await this.db.select().from(tokens).where(
        eq(tokens.id, params.tokenId),
      );
      //@ts-expect-error not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetMany(
    params: { offset?: number; limit?: number; shop: string },
  ): Promise<Array<Token>> {
    try {
      if (params.limit == undefined) {
        params.limit = 10;
      }

      if (params.offset == undefined) {
        params.offset = 0;
      }

      const result = await this.db.select().from(tokens).where(
        eq(tokens.shop, params.shop),
      ).limit(params.limit).offset(params.offset);
      //@ts-expect-error not on type
      return result;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Delete(params: { tokenId: string }): Promise<void> {
    try {
      await this.db.delete(tokens).where(eq(tokens.id, params.tokenId));
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
