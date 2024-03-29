import IOrganizationService from "../interfaces/organizationService.ts";
import { DatabaseError } from "../../utils/errors.ts";
import { organizations } from "../../utils/schema.ts";
import { and, eq, type PostgresJsDatabase } from "../../deps.ts";
import { Organization } from "../../utils/validator.ts";

export default class OrganizationService implements IOrganizationService {
  db: PostgresJsDatabase;
  constructor(db: PostgresJsDatabase) {
    this.db = db;
  }

  async Create(params: { data: Organization }): Promise<Organization> {
    try {
      //@ts-ignore not on type
      const result = await this.db.insert(organizations).values({
        name: params.data.name,
      }).returning();

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Get(params: { id: string }): Promise<Organization> {
    try {
      const result = await this.db.select().from(organizations).where(
        and(
          eq(organizations.deleted, false),
          eq(organizations.publicId, params.id),
        ),
      );

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Update(params: { data: Organization }): Promise<Organization> {
    try {
      const result = await this.db.update(organizations)
        .set({
          name: params.data.name,
        })
        .where(eq(organizations.publicId, params.data.publicId!))
        .returning();

      return result[0];
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }

  async Delete(params: { id: string }): Promise<void> {
    try {
      await this.db.update(organizations).set({
        deleted: true,
      }).where(
        eq(organizations.publicId, params.id),
      );
    } catch (error) {
      throw new DatabaseError("DB error", {
        cause: error,
      });
    }
  }
}
