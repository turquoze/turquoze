import DataService from "./dataService.ts";
import { Plugin } from "../utils/validator.ts";
import { plugins } from "../utils/schema.ts";
import { PostgresJsDatabase } from "../deps.ts";

export default class PluginService extends DataService<Plugin> {
  constructor(db: PostgresJsDatabase) {
    super(db, plugins);
  }
}
