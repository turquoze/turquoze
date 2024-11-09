import DataService from "./dataService.ts";
import { OrganizationLink } from "../utils/validator.ts";
import { organizationsLink, warehouses } from "../utils/schema.ts";
import { and, eq, PostgresJsDatabase } from "../deps.ts";
import { DatabaseError } from "../utils/errors.ts";

export default class OrganizationLinkService
  extends DataService<OrganizationLink> {
  constructor(db: PostgresJsDatabase) {
    super(db, warehouses);
  }

  override Create(_params: { data: object }): Promise<OrganizationLink> {
    throw Error("Not implemented");
  }

  override Get(_params: { id: string }): Promise<OrganizationLink> {
    throw Error("Not implemented");
  }

  override GetMany(
    _params: {
      offset?: number | undefined;
      limit?: number | undefined;
      shop: string;
    },
  ): Promise<OrganizationLink[]> {
    throw Error("Not implemented");
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

  override async Delete(
    params: { id: string; data: OrganizationLink },
  ): Promise<void> {
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
