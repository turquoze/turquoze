import DataService from "../interfaces/dataService.ts";
import client from "./_client.ts";
import { postgres } from "./_deps.ts";

export default class PostgresService implements DataService {
  client: postgres.Client;
  constructor() {
    this.client = client;
  }

  async Create<T>(params: { data: T; tabel: string }): Promise<T> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<T>({
        text: "INSERT INTO $1 VALUES $2",
        args: [params.tabel, params.data],
      });

      return result.rows[0];
    } catch (error) {
      throw new Error("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }

  async Get<T>(params: { id: string; tabel: string }): Promise<T> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<T>({
        text: "SELECT * FROM $1 WHERE id = $2 LIMIT 1",
        args: [params.tabel, params.id],
      });

      return result.rows[0];
    } catch (error) {
      throw new Error("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }

  async GetMany<T>(
    params: { offset: string; limit: number; tabel: string },
  ): Promise<Array<T>> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<T>({
        text: "SELECT * FROM $1 LIMIT $2 OFFSET $3",
        args: [params.tabel, params.limit, params.offset],
      });

      return result.rows;
    } catch (error) {
      throw new Error("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }

  async Update<T>(params: { id: string; data: T; tabel: string }): Promise<T> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<T>({
        text: "UPDATE $1 WHERE SET $2 WHERE id = $3",
        args: [params.tabel, params.data, params.id],
      });

      return result.rows[0];
    } catch (error) {
      throw new Error("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }

  async Delete<T>(params: { id: string; tabel: string }): Promise<T> {
    try {
      await this.client.connect();

      const result = await this.client.queryObject<T>({
        text: "DELETE FROM $1 WHERE id = $2",
        args: [params.tabel, params.id],
      });

      return result.rows[0];
    } catch (error) {
      throw new Error("DB error", {
        cause: error,
      });
    } finally {
      await this.client.end();
    }
  }
}
