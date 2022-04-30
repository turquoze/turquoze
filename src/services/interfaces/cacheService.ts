export default interface ICacheService {
  get(id: string): Promise<Record<string, unknown> | null>;

  set(params: {
    id: string;
    data: Record<string, unknown>;
    expire: number | null;
  }): Promise<void>;

  delete(id: string): Promise<void>;
}
