import IAdminService from "../interfaces/adminService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import { and, eq, type PostgresJsDatabase, sql } from "../../deps.ts";
import { admins } from "../../utils/schema.ts";
import { Admin } from "../../utils/validator.ts";

export default class AdminService implements IAdminService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Create(params: { data: Admin }): Promise<Admin> {
    try {
      const result = await this.db.execute(
        sql`INSERT INTO admins (email, name, not_active, password) VALUES (${params.data.email}, ${params.data.name}, ${params.data.notActive}, crypt(${params.data.password}, gen_salt('bf'))) RETURNING public_id`,
      );

      const admin: Admin = {
        email: "",
        password: "__REDACTED__",
        createdAt: "",
        //@ts-ignore TS2578
        publicId: result[0].public_id,
        name: "",
        notActive: undefined,
      };

      return admin;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Get(params: { id: string }): Promise<Admin> {
    try {
      //@ts-expect-error not on type
      const result = await this.db.select().from(admins).where(
        and(
          //@ts-expect-error not on type
          eq(admins.deleted, false),
          //@ts-expect-error not on type
          eq(admins.publicId, params.id),
        ),
      ).limit(1);

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

      const admin: Admin = {
        //@ts-ignore TS2578
        email: result[0].email,
        password: "__REDACTED__",
        //@ts-ignore TS2578
        createdAt: result[0].created_at,
        //@ts-ignore TS2578
        publicId: result[0].public_id,
        //@ts-ignore TS2578
        name: result[0].name,
        //@ts-ignore TS2578
        notActive: result[0].not_active,
      };

      return admin;
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

      const admin: Admin = {
        email: "",
        password: "__REDACTED__",
        createdAt: "",
        //@ts-ignore TS2578
        publicId: result[0].public_id,
        name: "",
        notActive: undefined,
      };

      return admin;
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

      //@ts-expect-error not on type
      const result = await this.db.select().from(admins).where(
        and(
          //@ts-expect-error not on type
          eq(admins.deleted, false),
          //@ts-expect-error not on type
          eq(admins.shop, params.shop),
        ),
      ).limit(params.limit)
        .offset(params.offset);

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
        //@ts-expect-error not on type
        admins,
      )
        .set({
          email: params.data.email,
          name: params.data.name,
          notActive: params.data.notActive,
        })
        //@ts-expect-error not on type
        .where(eq(admins.publicId, params.data.publicId!))
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
      //@ts-expect-error not on type
      await this.db.update(admins).set({
        deleted: true,
        //@ts-expect-error not on type
      }).where(eq(admins.publicId, params.id));
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
