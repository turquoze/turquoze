import { Settings } from "../../utils/types.ts";

export default interface ISettingsService {
  Upsert(params: {
    data: Settings;
    shopId: string;
  }): Promise<void>;

  GetById(params: {
    id: string;
  }): Promise<string>;

  Get(): Promise<Settings>;
}
