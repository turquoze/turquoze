import DataService from "./dataService.ts";
import { Organization } from "../utils/validator.ts";
import { organizations } from "../utils/schema.ts";
import { PostgresJsDatabase } from "../deps.ts";

export default class OrganizationService extends DataService<Organization> {
  constructor(db: PostgresJsDatabase) {
    super(db, organizations);
  }
}
