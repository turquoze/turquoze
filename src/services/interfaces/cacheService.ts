export default interface ICacheService {
  get<T>(shop: string, key: string): Promise<T>;

  set<T>(params: {
    shop: string;
    key: string;
    data: T;
    expire?: number;
  }): Promise<void>;

  delete(shop: string, key: string): Promise<void>;
}
