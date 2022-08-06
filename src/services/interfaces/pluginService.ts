export default interface IPluginService {
  Get<T>(id: string): T;

  Add(id: string, plugin: unknown): void;
}
