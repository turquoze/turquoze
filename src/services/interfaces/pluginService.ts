import { Plugin } from "../../utils/schema.ts";

export default interface IPluginService {
  Create(params: {
    data: Plugin;
  }): Promise<Plugin>;

  Get(params: {
    id: string;
  }): Promise<Plugin>;

  Update(params: {
    data: Plugin;
  }): Promise<Plugin>;

  Delete(params: {
    id: string;
  }): Promise<void>;
}
