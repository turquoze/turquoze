export default interface DataService {
  Create<T>(params: {
    data: T;
  }): Promise<T>;

  Get<T>(params: {
    id: string;
  }): Promise<T>;

  GetMany<T>(params: {
    offset: string;
    limit: number;
  }): Promise<Array<T>>;

  Update<T>(params: {
    id: string;
    data: T;
  }): Promise<T>;

  Delete<T>(params: {
    id: string;
  }): Promise<T>;
}
