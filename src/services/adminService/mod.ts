import { Admin } from "../../utils/types.ts";
import IAdminService from "../interfaces/adminService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import { admins } from "../../utils/schema.ts";
import { eq } from "drizzle-orm";

export default class AdminService implements IAdminService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Create(params: { data: Admin }): Promise<Admin> {
    try {
      const result = await this.db.execute(
        sql`INSERT INTO admins (email, name, not_active, password) VALUES (${params.data.email}, ${params.data.name}, ${params.data.not_active}, crypt(${params.data.password}, gen_salt('bf'))) RETURNING public_id`,
      );

      //@ts-expect-error not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Get(params: { id: string }): Promise<Admin> {
    try {
      const result = await this.db.select().from(admins).where(
        eq(admins.publicId, params.id),
      );
      // @ts-expect-error not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Login(
    params: { email: string; password: string },
  ): Promise<Admin> {
    try {
      const result = await this.db.execute(
        sql`SELECT * FROM admins WHERE email = ${params.email} AND password = crypt(${params.password}, password)`,
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
  ): Promise<Admin> {
    try {
      const result = await this.db.execute(
        sql`UPDATE admins SET password = crypt(${params.new_password}, gen_salt('bf')) WHERE email = ${params.email} RETURNING public_id`,
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
  ): Promise<Array<Admin>> {
    try {
      if (params.limit == undefined) {
        params.limit = 10;
      }

      if (params.offset == undefined) {
        params.offset = 0;
      }

      const result = await this.db.select().from(admins).limit(params.limit)
        .offset(params.offset);
      // @ts-expect-error not on type
      return result;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Update(params: { data: Admin }): Promise<Admin> {
    try {
      const result = await this.db.update(
        admins,
      )
        .set({
          email: params.data.email,
          name: params.data.name,
          notActive: params.data.not_active,
        })
        .where(eq(admins.publicId, params.data.publicId))
        .returning({
          publicId: admins.publicId,
        });

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
      await this.db.delete(admins).where(eq(admins.publicId, params.id));
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
