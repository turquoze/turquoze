import DataService from "./dataService.ts";
import { Warehouse } from "../utils/validator.ts";
import { warehouses } from "../utils/schema.ts";
import { PostgresJsDatabase } from "../deps.ts";

export default class WarehouseService extends DataService<Warehouse> {
  constructor(db: PostgresJsDatabase) {
    super(db, warehouses);
  }
}
