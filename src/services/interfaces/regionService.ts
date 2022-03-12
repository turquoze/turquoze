import { Region } from "../../utils/types.ts";

export default interface IRegionService {
  Create(params: {
    data: Region;
  }): Promise<Region>;

  Get(params: {
    id: string;
  }): Promise<Region>;

  Update(params: {
    data: Region;
  }): Promise<Region>;

  Delete(params: {
    id: string;
  }): Promise<void>;
}
