export default interface ICacheService {
  get<T>(id: string): Promise<T>;

  set(params: {
    id: string;
    data: string;
    expire: number;
  }): Promise<void>;

  delete(id: string): Promise<void>;
}
