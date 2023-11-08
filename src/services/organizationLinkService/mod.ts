import IOrganizationLinkService from "../interfaces/organizationLinkService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { OrganizationLink, organizationsLink } from "../../utils/schema.ts";
import { and, eq } from "drizzle-orm";

export default class OrganizationLinkService
  implements IOrganizationLinkService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Link(params: { data: OrganizationLink }): Promise<OrganizationLink> {
    try {
      //@ts-ignore not on type
      const result = await this.db.insert(organizationsLink).values({
        person: params.data.person,
        shop: params.data.shop,
      }).returning();

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Delete(params: { data: OrganizationLink }): Promise<void> {
    try {
      await this.db.delete(organizationsLink).where(
        and(
          eq(organizationsLink.person, params.data.person),
          eq(organizationsLink.shop, params.data.shop),
        ),
      );
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
      const result = await this.db.select().from(organizationsLink).where(
        eq(organizationsLink.person, params.personId),
      );
      //@ts-ignore not on type
      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
