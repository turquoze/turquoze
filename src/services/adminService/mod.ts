import { Admin } from "../../utils/types.ts";
import IAdminService from "../interfaces/adminService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { Pool } from "../../deps.ts";

export default class AdminService implements IAdminService {
  pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  async Create(params: { data: Admin }): Promise<Admin> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Admin>({
        text:
          "INSERT INTO admins (email, name, not_active, password) VALUES ($1, $2, $3, crypt($4, gen_salt('bf'))) RETURNING public_id",
        args: [
          params.data.email,
          params.data.name,
          params.data.not_active,
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

  async Get(params: { id: string }): Promise<Admin> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Admin>({
        text: "SELECT * FROM admins WHERE public_id = $1 LIMIT 1",
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
    params: { email: string; password: string },
  ): Promise<Admin> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Admin>({
        text:
          "SELECT * FROM admins WHERE email = $1 AND password = crypt($2, password)",
        args: [params.email, params.password],
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
  ): Promise<Admin> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Admin>({
        text:
          "UPDATE admins SET password = crypt($1, gen_salt('bf')) WHERE email = $2 RETURNING public_id",
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
  ): Promise<Array<Admin>> {
    try {
      if (params.limit == null) {
        params.limit = 10;
      }

      const client = await this.pool.connect();

      const result = await client.queryObject<Admin>({
        text: "SELECT * FROM admins LIMIT $1 OFFSET $2",
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

  async Update(params: { data: Admin }): Promise<Admin> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Admin>({
        text:
          "UPDATE admins SET email = $1, name = $2, not_active = $3 WHERE public_id = $4 RETURNING public_id",
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

      await client.queryObject<Admin>({
        text: "DELETE FROM admins WHERE public_id = $1",
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
