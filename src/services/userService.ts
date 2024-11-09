import DataService from "./dataService.ts";
import { PostgresJsDatabase, sql } from "../deps.ts";
import { User } from "../utils/validator.ts";
import { users } from "../utils/schema.ts";
import { DatabaseError } from "../utils/errors.ts";

export default class UserService extends DataService<User> {
  constructor(db: PostgresJsDatabase) {
    super(db, users);
  }

  override async Create(params: { data: object }): Promise<User> {
    try {
      const result = await this.db.execute(
        //@ts-expect-error not on type
        sql`INSERT INTO users (email, name, not_active, shop, password) VALUES (${params.data.email}, ${params.data.name}, ${params.data.notActive}, ${params.data.shop}, crypt(${params.data.password}, gen_salt('bf'))) RETURNING public_id`,
      );

      const user: User = {
        email: "",
        password: "__REDACTED__",
        createdAt: "",
        //@ts-ignore TS2578
        publicId: result[0].public_id,
        name: "",
        notActive: undefined,
      };

      return this.#cleanResponseData(user);
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  override async Get(params: { id: string }): Promise<User> {
    const data = await super.Get(params) as User;
    return this.#cleanResponseData(data);
  }

  override async GetMany(
    params: {
      offset?: number | undefined;
      limit?: number | undefined;
      shop: string;
    },
  ): Promise<User[]> {
    const data = await super.GetMany(params) as Array<User>;
    return data.map((user) => {
      return this.#cleanResponseData(user);
    });
  }

  async Login(
    params: { email: string; password: string; shop: string },
  ): Promise<User> {
    try {
      const result = await this.db.execute(
        sql`SELECT * FROM users WHERE shop = ${params.shop} AND email = ${params.email} AND password = crypt(${params.password}, password)`,
      );

      const user: User = {
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
        //@ts-ignore TS2578
        role: result[0].role,
      };

      return user;
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

      const user: User = {
        email: "",
        password: "__REDACTED__",
        createdAt: "",
        //@ts-ignore TS2578
        publicId: result[0].public_id,
        name: "",
        notActive: undefined,
      };

      return user;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  #cleanResponseData(user: User) {
    //TODO: hide data
    return user;
  }
}
