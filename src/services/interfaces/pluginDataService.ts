import { PluginData } from "../../utils/types.ts";

export default interface IPluginDataService {
  Create<T>(params: {
    data: PluginData<T>;
  }): Promise<PluginData<T>>;

  Get<T>(params: {
    id: string;
  }): Promise<PluginData<T>>;

  Update<T>(params: {
    data: PluginData<T>;
  }): Promise<PluginData<T>>;

  Delete(params: {
    id: string;
  }): Promise<void>;
}
