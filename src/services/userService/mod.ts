import { User } from "../../utils/types.ts";
import IUserService from "../interfaces/userService.ts";
import type postgresClient from "../dataClient/client.ts";
import { DatabaseError } from "../../utils/errors.ts";
import ICacheService from "../interfaces/cacheService.ts";

export default class UserService implements IUserService {
  client: typeof postgresClient;
  cache: ICacheService;
  constructor(client: typeof postgresClient, cache: ICacheService) {
    this.client = client;
    this.cache = cache;
  }

  async Create(params: { data: User }): Promise<User> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<User>({
        text:
          "INSERT INTO users (email, name, not_active, region) VALUES ($1, $2, $3, $4) RETURNING system_id",
        args: [
          params.data.email,
          params.data.name,
          params.data.not_active,
          params.data.region,
        ],
      });

      await this.cache.set({
        id: params.data.id,
        data: { user: params.data },
        expire: Date.now() + (60000 * 60),
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
      const cacheResult = await this.cache.get(params.id);

      if (cacheResult != null) {
        // @ts-expect-error wrong type
        return cacheResult.user;
      }

      await this.client.connect();

      const result = await this.client.queryObject<User>({
        text: "SELECT * FROM users WHERE system_id = $1 LIMIT 1",
        args: [params.id],
      });

      await this.cache.set({
        id: params.id,
        data: { user: result.rows[0] },
        expire: Date.now() + (60000 * 60),
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

      const cacheResult = await this.cache.get(
        `usersGetMany-${params.limit}-${params.offset}`,
      );

      if (cacheResult != null) {
        // @ts-expect-error wrong type
        return cacheResult.users;
      }

      await this.client.connect();

      const result = await this.client.queryObject<User>({
        text: "SELECT * FROM users LIMIT $1 OFFSET $2",
        args: [params.limit, params.offset],
      });

      await this.cache.set({
        id: `usersGetMany-${params.limit}-${params.offset}`,
        data: { users: result.rows },
        expire: Date.now() + (60000 * 10),
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
          "UPDATE users SET email = $1, name = $2, not_active = $3 WHERE system_id = $4 RETURNING system_id",
        args: [
          params.data.email,
          params.data.name,
          params.data.not_active,
          params.data.system_id,
        ],
      });

      await this.cache.set({
        id: params.data.id,
        data: { user: params.data },
        expire: Date.now() + (60000 * 60),
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
        text: "DELETE FROM users WHERE system_id = $1",
        args: [params.id],
      });

      await this.cache.delete(params.id);
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }
}
