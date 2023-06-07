import IOrganizationService from "../interfaces/organizationService.ts";
import { Organization } from "../../utils/types.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { Pool } from "../../deps.ts";

export default class OrganizationService implements IOrganizationService {
  pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  async Create(params: { data: Organization }): Promise<Organization> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Organization>({
        text:
          "INSERT INTO organizations (name) VALUES ($1) RETURNING public_id",
        args: [
          params.data.name,
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

  async Get(params: { id: string }): Promise<Organization> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Organization>({
        text: "SELECT * FROM organizations WHERE public_id = $1 LIMIT 1",
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

  async Update(params: { data: Organization }): Promise<Organization> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<Organization>({
        text:
          "UPDATE organizations SET name = $1 WHERE public_id = $2 RETURNING public_id",
        args: [
          params.data.name,
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

      await client.queryObject<void>({
        text: "DELETE FROM organizations WHERE public_id = $1",
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
