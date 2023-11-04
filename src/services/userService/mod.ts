import { User } from "../../utils/types.ts";
import IUserService from "../interfaces/userService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import { users } from "../../utils/schema.ts";
import { eq } from "drizzle-orm";

export default class UserService implements IUserService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Create(params: { data: User }): Promise<User> {
    try {
      const result = await this.db.execute(
        sql`INSERT INTO users (email, name, not_active, shop, password) VALUES (${params.data.email}, ${params.data.name}, ${params.data.not_active}, ${params.data.shop}, crypt(${params.data.password}, gen_salt('bf'))) RETURNING public_id`,
      );

      //@ts-expect-error not on type
      return { publicId: result[0].public_id };
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Get(params: { id: string }): Promise<User> {
    try {
      const result = await this.db.select().from(users).where(
        eq(users.publicId, params.id),
      );
      //@ts-expect-error not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Login(
    params: { email: string; password: string; shop: string },
  ): Promise<User> {
    try {
      const result = await this.db.execute(
        sql`SELECT * FROM users WHERE shop = ${params.shop} AND email = ${params.email} AND password = crypt(${params.password}, password)`,
      );

      //@ts-expect-error not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async UpdatePassword(
    params: { email: string; new_password: string },
  ): Promise<User> {
    try {
      const result = await this.db.execute(
        sql`UPDATE users SET password = crypt(${params.new_password}, gen_salt('bf')) WHERE email = ${params.email} RETURNING public_id`,
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
  ): Promise<Array<User>> {
    try {
      if (params.limit == undefined) {
        params.limit = 10;
      }

      if (params.offset == undefined) {
        params.offset = 0;
      }

      const result = await this.db.select().from(users).where(
        eq(users.shop, params.shop),
      ).limit(params.limit).offset(params.offset);
      // @ts-expect-error not on type
      return result;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Update(params: { data: User }): Promise<User> {
    try {
      const result = await this.db.update(users)
        .set({
          email: params.data.email,
          name: params.data.name,
          notActive: params.data.not_active,
        })
        .where(eq(users.publicId, params.data.publicId))
        .returning();

      // @ts-expect-error not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Delete(params: { id: string }): Promise<void> {
    try {
      await this.db.delete(users).where(eq(users.publicId, params.id));
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
