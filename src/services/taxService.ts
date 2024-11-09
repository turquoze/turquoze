import DataService from "./dataService.ts";
import { Tax } from "../utils/validator.ts";
import { taxes } from "../utils/schema.ts";
import { PostgresJsDatabase } from "../deps.ts";

export default class TaxService extends DataService<Tax> {
  constructor(db: PostgresJsDatabase) {
    super(db, taxes);
  }
}
