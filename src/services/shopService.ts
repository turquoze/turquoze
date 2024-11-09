import DataService from "./dataService.ts";
import { Shop } from "../utils/validator.ts";
import { shops } from "../utils/schema.ts";
import { PostgresJsDatabase } from "../deps.ts";

export default class ShopService extends DataService<Shop> {
  constructor(db: PostgresJsDatabase) {
    super(db, shops);
  }
}
