import IPluginService from "../interfaces/pluginService.ts";

export default class PluginService implements IPluginService {
  plugins: Map<string, unknown>;
  constructor() {
    this.plugins = new Map<string, unknown>();
  }

  Get<T>(id: string): T {
    if (this.plugins.has(id)) {
      return this.plugins.get(id) as T;
    } else {
      throw new Error("Could not find plugin");
    }
  }

  Add(id: string, plugin: unknown) {
    this.plugins.set(id, plugin);
  }
}
