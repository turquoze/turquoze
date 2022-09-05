import { Media } from "../../utils/types.ts";

export default interface IStorageService {
  Create(params: {
    data: Media;
  }): Promise<string>;

  Get(params: {
    name: string;
    public: boolean;
  }): Promise<string>;

  Delete(params: {
    name: string;
    public: boolean;
  }): Promise<void>;
}
