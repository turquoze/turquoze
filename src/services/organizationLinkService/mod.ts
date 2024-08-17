import IOrganizationLinkService from "../interfaces/organizationLinkService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import { organizationsLink } from "../../utils/schema.ts";
import { and, eq, type PostgresJsDatabase } from "../../deps.ts";
import { OrganizationLink } from "../../utils/validator.ts";

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
      //@ts-expect-error not on type
      await this.db.delete(organizationsLink).where(
        and(
          //@ts-expect-error not on type
          eq(organizationsLink.person, params.data.person),
          //@ts-expect-error not on type
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
      //@ts-expect-error not on type
      const result = await this.db.select().from(organizationsLink).where(
        //@ts-expect-error not on type
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
