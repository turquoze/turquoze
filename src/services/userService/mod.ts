import { User } from "../../utils/types.ts";
import IUserService from "../interfaces/userService.ts";
import type postgresClient from "../dataClient/client.ts";
import { DatabaseError } from "../../utils/errors.ts";

export default class UserService implements IUserService {
  client: typeof postgresClient;
  constructor(client: typeof postgresClient) {
    this.client = client;
  }

  async Create(params: { data: User }): Promise<User> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<User>({
        text:
          "INSERT INTO users (email, name, not_active, shop) VALUES ($1, $2, $3, $4) RETURNING public_id",
        args: [
          params.data.email,
          params.data.name,
          params.data.not_active,
          params.data.shop,
        ],
      });

      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }

  async Get(params: { id: string }): Promise<User> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<User>({
        text: "SELECT * FROM users WHERE public_id = $1 LIMIT 1",
        args: [params.id],
      });

      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }

  async GetMany(
    params: { offset?: string; limit?: number },
  ): Promise<Array<User>> {
    try {
      if (params.limit == null) {
        params.limit = 10;
      }

      await this.client.connect();

      const result = await this.client.queryObject<User>({
        text: "SELECT * FROM users LIMIT $1 OFFSET $2",
        args: [params.limit, params.offset],
      });

      return result.rows;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }

  async Update(params: { data: User }): Promise<User> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<User>({
        text:
          "UPDATE users SET email = $1, name = $2, not_active = $3 WHERE public_id = $4 RETURNING public_id",
        args: [
          params.data.email,
          params.data.name,
          params.data.not_active,
          params.data.public_id,
        ],
      });

      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }

  async Delete(params: { id: string }): Promise<void> {
    try {
      await this.client.connect();

      await this.client.queryObject<User>({
        text: "DELETE FROM users WHERE public_id = $1",
        args: [params.id],
      });
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }
}
