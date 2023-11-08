import { Shop, TurquozeRole } from "../../utils/types.ts";
import ITokenService from "../interfaces/tokenService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import { Token, tokens } from "../../utils/schema.ts";
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

      //@ts-ignore not on type
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
        sql`SELECT shops.*, tokens.role FROM tokens RIGHT JOIN shops ON tokens.shop = shops.public_id WHERE tokens.id = ${params.tokenId} AND tokens.secret = crypt(${params.tokenSecret}, tokens.secret) LIMIT 1`,
      );

      const shop: Shop = {
        // @ts-expect-error not on type
        id: result[0].id,
        // @ts-expect-error not on type
        publicId: result[0].public_id,
        // @ts-expect-error not on type
        currency: result[0].currency,
        // @ts-expect-error not on type
        name: result[0].name,
        // @ts-expect-error not on type
        regions: result[0].regions,
        // @ts-expect-error not on type
        search_index: result[0].search_index,
        // @ts-expect-error not on type
        secret: result[0].secret,
        // @ts-expect-error not on type
        settings: result[0].settings,
        // @ts-expect-error not on type
        url: result[0].url,
        // @ts-expect-error not on type
        paymentId: result[0].payment_id,
        // @ts-expect-error not on type
        shippingId: result[0].shipping_id,
      };

      return {
        shop: shop,
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
