import { User } from "../../utils/types.ts";
import IUserService from "../interfaces/userService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { Pool } from "../../deps.ts";

export default class UserService implements IUserService {
  pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  async Create(params: { data: User }): Promise<User> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<User>({
        text:
          "INSERT INTO users (email, name, not_active, shop, password) VALUES ($1, $2, $3, $4, crypt($5, gen_salt('bf'))) RETURNING public_id",
        args: [
          params.data.email,
          params.data.name,
          params.data.not_active,
          params.data.shop,
          params.data.password,
        ],
      });

      client.release();
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Get(params: { id: string }): Promise<User> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<User>({
        text: "SELECT * FROM users WHERE public_id = $1 LIMIT 1",
        args: [params.id],
      });

      client.release();
      return result.rows[0];
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
      const client = await this.pool.connect();

      const result = await client.queryObject<User>({
        text:
          "SELECT * FROM users WHERE shop = $1 AND email = $2 AND password = crypt($3, password)",
        args: [params.shop, params.email, params.password],
      });

      client.release();
      return result.rows[0];
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
      const client = await this.pool.connect();

      const result = await client.queryObject<User>({
        text:
          "INSERT INTO users (password) VALUES (crypt($1, gen_salt('bf'))) WHERE email = $2 RETURNING public_id",
        args: [
          params.new_password,
          params.email,
        ],
      });

      client.release();
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetMany(
    params: { offset?: string; limit?: number },
  ): Promise<Array<User>> {
    try {
      if (params.limit == null) {
        params.limit = 10;
      }

      const client = await this.pool.connect();

      const result = await client.queryObject<User>({
        text: "SELECT * FROM users LIMIT $1 OFFSET $2",
        args: [params.limit, params.offset],
      });

      client.release();
      return result.rows;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Update(params: { data: User }): Promise<User> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<User>({
        text:
          "UPDATE users SET email = $1, name = $2, not_active = $3 WHERE public_id = $4 RETURNING public_id",
        args: [
          params.data.email,
          params.data.name,
          params.data.not_active,
          params.data.public_id,
        ],
      });

      client.release();
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Delete(params: { id: string }): Promise<void> {
    try {
      const client = await this.pool.connect();

      await client.queryObject<User>({
        text: "DELETE FROM users WHERE public_id = $1",
        args: [params.id],
      });

      client.release();
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
