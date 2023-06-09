import { OrganizationLink } from "../../utils/types.ts";
import IOrganizationLinkService from "../interfaces/organizationLinkService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { Pool } from "../../deps.ts";

export default class OrganizationLinkService
  implements IOrganizationLinkService {
  pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }

  async Link(params: { data: OrganizationLink }): Promise<OrganizationLink> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<OrganizationLink>({
        text: "INSERT INTO organizationsLink (person, shop) VALUES ($1, $2)",
        args: [params.data.person, params.data.shop],
      });

      client.release();
      return result.rows[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Delete(params: { data: OrganizationLink }): Promise<void> {
    try {
      const client = await this.pool.connect();

      await client.queryObject<OrganizationLink>({
        text: "DELETE FROM organizationsLink WHERE (person = $1 AND shop = $2)",
        args: [params.data.person, params.data.shop],
      });

      client.release();
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async GetOrganizations(
    params: { personId: string },
  ): Promise<OrganizationLink[]> {
    try {
      const client = await this.pool.connect();

      const result = await client.queryObject<OrganizationLink>({
        text: "SELECT * FROM organizationsLink WHERE person = $1",
        args: [params.personId],
      });

      client.release();
      return result.rows;
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
