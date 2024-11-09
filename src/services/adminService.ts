import DataService from "./dataService.ts";
import { PostgresJsDatabase, sql } from "../deps.ts";
import { Admin } from "../utils/validator.ts";
import { admins } from "../utils/schema.ts";
import { DatabaseError } from "../utils/errors.ts";

export default class AdminService extends DataService<Admin> {
  constructor(db: PostgresJsDatabase) {
    super(db, admins);
  }

  override async Create(params: { data: object }): Promise<Admin> {
    try {
      const result = await this.db.execute(
        //@ts-expect-error not on type
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

      return this.#cleanResponseData(admin);
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  override async Get(params: { id: string }): Promise<Admin> {
    const data = await super.Get(params) as Admin;
    return this.#cleanResponseData(data);
  }

  override async GetMany(
    params: {
      offset?: number | undefined;
      limit?: number | undefined;
      shop: string;
    },
  ): Promise<Admin[]> {
    const data = await super.GetMany(params) as Array<Admin>;
    return data.map((user) => {
      return this.#cleanResponseData(user);
    });
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

  #cleanResponseData(user: Admin) {
    //TODO: hide data
    return user;
  }
}
