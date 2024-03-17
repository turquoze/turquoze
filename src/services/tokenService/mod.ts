import { TurquozeRole } from "../../utils/types.ts";
import ITokenService from "../interfaces/tokenService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import { tokens } from "../../utils/schema.ts";
import { DBShop as Shop, Token } from "../../utils/validator.ts";
import { and, eq, type PostgresJsDatabase, sql } from "../../deps.ts";

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

      const token: Token = {
        //@ts-ignore TS2578
        id: result[0].id,
        name: "",
        secret: "__REDACTED__",
        shop: "",
      };

      return token;
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
        //@ts-ignore not on type
        id: result[0].id,
        //@ts-ignore not on type
        publicId: result[0].public_id,
        //@ts-ignore not on type
        currency: result[0].currency,
        //@ts-ignore not on type
        name: result[0].name,
        //@ts-ignore not on type
        regions: result[0].regions,
        //@ts-ignore not on type
        searchIndex: result[0].search_index,
        //@ts-ignore not on type
        secret: result[0].secret,
        //@ts-ignore not on type
        settings: result[0].settings,
        //@ts-ignore not on type
        url: result[0].url,
        //@ts-ignore not on type
        paymentId: result[0].payment_id,
        //@ts-ignore not on type
        shippingId: result[0].shipping_id,
      };

      return {
        shop: shop,
        //@ts-ignore not on type
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
        and(
          eq(tokens.deleted, false),
          eq(tokens.id, params.tokenId),
        ),
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
        and(
          eq(tokens.deleted, false),
          eq(tokens.shop, params.shop),
        ),
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
